const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType } = require('graphql');
const Project = require('../models/project');
const Client = require('../models//client');


// client 
const ClientType = new GraphQLObjectType({
    name: "Client",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
})


// project
const ProjectType = new GraphQLObjectType({
    name: "Project",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {
                return Client.findById(parent.clientId)
            }
        }
    })
})


// query
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: () => ({
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parents, args) {
                return Client.find()
            }
        },
        client: {
            type: ClientType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Client.findById(parent.clientId)
            }
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return Project.find()
            }
        },
        project: {
            type: ProjectType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Project.findById(args.id)
            }
        }
    })
})

const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => (
        {
            addClient: {
                type: ClientType,
                args: {
                    name: { type: new GraphQLNonNull(GraphQLString) },
                    email: { type: new GraphQLNonNull(GraphQLString) },
                    phone: { type: new GraphQLNonNull(GraphQLString) },
                },
                resolve(parent, args) {
                    const client = new Client({
                        name: args.name,
                        email: args.email,
                        phone: args.phone
                    })
                    return client.save()
                }
            },
            deleteClient: {
                type: ClientType,
                args: {
                    id: { type: new GraphQLNonNull(GraphQLID) },
                },
                resolve(parent, args) {
                    return Client.findByIdAndDelete(args.id)
                }
            },
            addProject: {
                type: ProjectType,
                args: {
                    name: { type: new GraphQLNonNull(GraphQLString) },
                    description: { type: new GraphQLNonNull(GraphQLString) },
                    status: {
                        type: new GraphQLEnumType({
                            name: 'ProjectStatus',
                            values: {
                                new: { value: "not started" },
                                progress: { value: "in progress" },
                                completed: { value: "completed" }
                            }
                        }),
                        defaultValue: "not started"
                    },
                    clientId: { type: new GraphQLNonNull(GraphQLID) }
                },
                resolve(parent, args) {
                    const project = new Project({
                        name: args.name,
                        description: args.description,
                        status: args.status,
                        clientId: args.clientId
                    })

                    return project.save()
                }
            },
            deleteProject: {
                type: ProjectType,
                args: {
                    id: { type: new GraphQLNonNull(GraphQLID) }
                },
                resolve(parent, args) {
                    return Project.findByIdAndDelete(args.id)
                }
            },
            updateProject: {
                type: ProjectType,
                args: {
                    id: { type: new GraphQLNonNull(GraphQLID) },
                    name: { type: new GraphQLNonNull(GraphQLString) },
                    description: { type: new GraphQLNonNull(GraphQLString) },
                    status: {
                        type: new GraphQLEnumType({
                            name: "projectStausUpdate",
                            values: {
                                new: { value: "not started" },
                                progress: { value: "in progress" },
                                completed: { value: "completed" }
                            },

                        })
                    }
                },
                resolve(parent, args) {
                    return Project.findByIdAndUpdate(
                        args.id,
                        {
                            $set: {
                                name: args.name,
                                description: args.description,
                                status: args.status
                            }
                        },
                        { new: true }
                    )
                }
            }

        }
    )
})

//export
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
})