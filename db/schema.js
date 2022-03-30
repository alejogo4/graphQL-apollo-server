const { gql } = require("apollo-server");

const typeDefs = gql`
  #Enums
  enum StatusOrder {
    PENDING
    COMPLETED
    CANCELED
  }

  #Types
  type User {
    id: ID
    name: String
    lastname: String
    email: String
    create_at: String
  }

  type Token {
    token: String
  }

  type Product {
    id: ID
    name: String
    existence: Int
    price: Float
    create_at: String
  }

  type Client {
    id: ID
    name: String
    lastname: String
    company: String
    email: String
    cellphone: String
    vendor: ID
  }

  type Order {
    id: ID
    ordder: [OrderGroup]
    total: Float
    client: Client
    vendor: ID
    date: String
    status: StatusOrder
  }

  type OrderGroup {
    id: ID
    amount: Int
    name: String
    price: Float
  }

  type TopClient {
    total: Float
    client: [Client]
  }

  type TopVendor {
    total: Float
    vendor: [User]
  }

  #Inputs
  input UserInput {
    name: String!
    lastname: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String
    password: String
  }

  input ProductInput {
    name: String!
    existence: Int!
    price: Float!
  }

  input ClientInput {
    name: String!
    lastname: String!
    company: String!
    email: String!
    cellphone: String
  }

  input ProductOrderInput {
    id: ID
    amount: Int
    name: String
    price: Float
  }

  input OrderInput {
    pedido: [ProductOrderInput]
    total: Float
    cliente: ID
    status: StatusOrder
  }

  #Queries
  type Query {
    #User
    getUser: User

    # Products
    getProducts: [Product]
    getProduct(id: ID!): Product

    #Clients
    getClients: [Client]
    getClientsVendor: [Client]
    getClient(id: ID!): Client

    # Orders
    getOrders: [Order]
    getOrdersVendor: [Order]
    getOrder(id: ID!): Order
    getOrdersByStatus(status: String!): [Order]

    # Search Advanced
    getBestClients: [TopClient]
    getBestVendors: [TopVendor]
    searchProduct(term: String!): [Product]
  }

  #Mutations
  type Mutation {
    #Users
    registerUser(input: UserInput!): User
    login(input: LoginInput!): Token

    # Products
    createProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deleteProduct(id: ID!): String

    # Clients
    createClient(input: ClientInput): Client
    updateClient(id: ID!, input: ClientInput): Client
    deleteCliente(id: ID!): String

    # Ordes
    createOrder(input: OrderInput): Order
    updateOrder(id: ID!, input: OrderInput): Order
    deleteOrder(id: ID!): String
  }
`;

module.exports = typeDefs;
