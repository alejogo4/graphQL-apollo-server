const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");
const Client = require("../models/Client");
const Order = require("../models/Order");

const createToken = (user, secret, expiresIn) => {
  const { id, email, name, lastname } = user;

  return jwt.sign({ id, email, name, lastname }, secret, { expiresIn });
};

const resolvers = {
  Query: {
    getUser: async (_, {}, ctx) => {
      return ctx.user;
    },
    getProducts: async () => {
      try {
        const products = await Product.find({});
        return products;
      } catch (error) {
        console.log(error);
      }
    },
    getProduct: async (_, { id }) => {
      const product = await Product.findById(id);

      if (!product) {
        throw new Error("Product not found");
      }

      return product;
    },
    getClients: async () => {
      try {
        const client = await Client.find({});
        return client;
      } catch (error) {
        console.log(error);
      }
    },
    getClientsVendor: async (_, {}, ctx) => {
      try {
        const client = await Client.find({
          vendor: ctx.user.id.toString(),
        });
        return client;
      } catch (error) {
        console.log(error);
      }
    },
    getClient: async (_, { id }, ctx) => {
      const client = await Client.findById(id);

      if (!client) {
        throw new Error("Client not found");
      }

      // Quien lo creo puede verlo
      if (client.vendor.toString() !== ctx.user.id) {
        throw new Error("No have permissions");
      }

      return client;
    },
    getOrders: async () => {
      try {
        const orders = await Order.find({});
        return orders;
      } catch (error) {
        console.log(error);
      }
    },
    getOrdersVendor: async (_, {}, ctx) => {
      try {
        const orders = await Orders.find({
          vendor: ctx.user.id,
        }).populate("client");

        return orders;
      } catch (error) {
        console.log(error);
      }
    },
    getOrder: async (_, { id }, ctx) => {
      const order = await Orders.findById(id);
      if (!order) {
        throw new Error("Order not found");
      }

      if (order.vendor.toString() !== ctx.user.id) {
        throw new Error("No have permission");
      }

      return order;
    },
    getOrdersByStatus: async (_, { status }, ctx) => {
      const orders = await Orders.find({ vendor: ctx.user.id, status });

      return orders;
    },
    getBestClients: async () => {
      const client = await Order.aggregate([
        { $match: { status: "COMPLETED" } },
        {
          $group: {
            _id: "$client",
            total: { $sum: "$total" },
          },
        },
        {
          $lookup: {
            from: "client",
            localField: "_id",
            foreignField: "_id",
            as: "client",
          },
        },
        {
          $limit: 10,
        },
        {
          $sort: { total: -1 },
        },
      ]);

      return client;
    },
    getBestVendors: async () => {
      const vendors = await Order.aggregate([
        { $match: { estado: "COMPLETADO" } },
        {
          $group: {
            _id: "$vendors",
            total: { $sum: "$total" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "vendors",
          },
        },
        {
          $limit: 3,
        },
        {
          $sort: { total: -1 },
        },
      ]);

      return vendors;
    },
    searchProduct: async (_, { term }) => {
      const products = await Order.find({
        $text: { $search: term },
      }).limit(10);

      return products;
    },
  },
  Mutation: {
    registerUser: async (_, { input }, ctx) => {
      const { email, password } = input;
      const user = await User.findOne({ email });
      if (user) {
        throw new Error("The user is registered");
      }

      const salt = bcryptjs.genSaltSync(10);
      input.password = bcryptjs.hashSync(password, salt);

      try {
        const user = new User(input);
        user.save();
        return user;
      } catch (error) {
        console.log(`Error create user ${error}`);
      }

      return input;
    },
    login: async (_, { input }, ctx) => {
      const { email, password } = input;

      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }

      const isCorrectPassword = await bcryptjs.compare(password, user.password);
      if (!isCorrectPassword) {
        throw new Error("Incorrect password");
      }

      // Crear el token
      return {
        token: createToken(user, process.env.SECRET, "8h"),
      };
    },
  },
};

module.exports = resolvers;
