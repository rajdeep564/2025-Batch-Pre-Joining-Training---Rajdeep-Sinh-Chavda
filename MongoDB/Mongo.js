// Category Collection 
db.createCollection("Category", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["categoryId", "name", "description"],
            properties: {
                categoryId: { bsonType: "string", description: "Must be a string" },
                name: { bsonType: "string", description: "Must be a string" },
                description: { bsonType: "string", description: "Must be a string" }
            }
        }
    }
});

db.Category.insertMany([
    { categoryId: "C001", name: "Phones", description: "Mobile devices and accessories" },
    { categoryId: "C002", name: "Clothes", description: "Fashion and daily wear" },
    { categoryId: "C003", name: "Books", description: "Novels, comics, and study materials" },
    { categoryId: "C004", name: "Shoes", description: "Footwear for all occasions" },
    { categoryId: "C005", name: "Home", description: "Furniture, decor, and appliances" }
]);

db.createCollection("Product", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["productId", "name", "price", "categoryId", "stock"],
            properties: {
                productId: { bsonType: "string", description: "Must be a string" },
                name: { bsonType: "string", description: "Must be a string" },
                price: { bsonType: "double", description: "Must be a decimal value" },
                categoryId: { bsonType: "string", description: "Must be a string" },
                stock: { bsonType: "int", minimum: 0, description: "Must be a positive integer" }
            }
        }
    }
});

db.Product.insertMany([
    { productId: "P001", name: "iPhone 14", price: 799.99, categoryId: "C001", stock: 30 },
    { productId: "P002", name: "Samsung Galaxy S23", price: 749.99, categoryId: "C001", stock: 25 },
    { productId: "P003", name: "Men's Cotton T-Shirt", price: 19.99, categoryId: "C002", stock: 100 },
    { productId: "P004", name: "Harry Potter Book", price: 9.99, categoryId: "C003", stock: 200 },
    { productId: "P005", name: "Running Shoes", price: 79.99, categoryId: "C004", stock: 60 }
]);

db.createCollection("Customer", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["customerId", "name", "email", "address"],
            properties: {
                customerId: { bsonType: "string", description: "Must be a string" },
                name: { bsonType: "string", description: "Must be a string" },
                email: { bsonType: "string", pattern: "^.+@.+$", description: "Must be a valid email" },
                address: { bsonType: "string", description: "Must be a string" }
            }
        }
    }
});

db.Customer.insertMany([
    { customerId: "CU001", name: "Rajesh Sharma", email: "rajesh@example.com", address: "123, MG Road, Delhi" },
    { customerId: "CU002", name: "Priya Singh", email: "priya@example.com", address: "456, Park Street, Mumbai" },
    { customerId: "CU003", name: "Amit Verma", email: "amit@example.com", address: "789, Gandhi Nagar, Bangalore" },
    { customerId: "CU004", name: "Neha Kapoor", email: "neha@example.com", address: "321, Sector 5, Chandigarh" },
    { customerId: "CU005", name: "Vikram Joshi", email: "vikram@example.com", address: "654, Anna Salai, Chennai" }
]);

db.createCollection("Order", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["orderId", "customerId", "products", "totalAmount", "orderDate", "status"],
            properties: {
                orderId: { bsonType: "string", description: "Must be a string" },
                customerId: { bsonType: "string", description: "Must be a string" },
                products: {
                    bsonType: "array",
                    minItems: 1,
                    items: {
                        bsonType: "object",
                        required: ["productId", "quantity"],
                        properties: {
                            productId: { bsonType: "string", description: "Must be a string" },
                            quantity: { bsonType: "int", minimum: 1, description: "Must be a positive integer" }
                        }
                    }
                },
                totalAmount: { bsonType: "double", description: "Must be a decimal value" },
                orderDate: { bsonType: "date", description: "Must be a valid date" },
                status: { bsonType: "string", enum: ["Pending", "Shipped", "Delivered", "Cancelled"], description: "Order status" }
            }
        }
    }
});

db.Order.insertMany([
    {
        orderId: "O001",
        customerId: "CU001",
        products: [
            { productId: "P001", quantity: 1 },
            { productId: "P005", quantity: 2 }
        ],
        totalAmount: 959.97,
        orderDate: new Date("2025-02-17"),
        status: "Pending"
    },
    {
        orderId: "O002",
        customerId: "CU002",
        products: [
            { productId: "P003", quantity: 3 },
            { productId: "P004", quantity: 1 }
        ],
        totalAmount: 69.96,
        orderDate: new Date("2025-02-16"),
        status: "Shipped"
    },
    {
        orderId: "O003",
        customerId: "CU003",
        products: [
            { productId: "P002", quantity: 1 }
        ],
        totalAmount: 749.99,
        orderDate: new Date("2025-02-15"),
        status: "Delivered"
    }
]);

// update a category 
db.Category.updateOne(
    { name: "Books" },
    { $set: { description: "All kinds of books" } }
);

//delete a category 
db.Category.deleteOne({ name: "Home" });

//display all categories 
db.Category.find().pretty();

//update a product
db.Product.updateOne(
    { productId: "P001" },
    { $set: { price: 749.99, stock: 45 } }
);

// delete a product 
db.Product.deleteOne({ productId: "P005" });

//insert a customer
db.Customer.insertOne({
    customerId: "CU006",
    name: "Rajdeep",
    email: "rajdeep87@gmail.com",
    address: "Jaipur"
});

//update a customer 
db.Customer.updateOne({ customerId: "CU006" }, { $set: { email: "rajdeep9898@gmail.com" } });

//fetch by email
db.Customer.findOne({ email: "rajdeep9898@gmail.com" });

//insert an order 
db.Order.insertOne({
    orderId: "O004",
    customerId: "CU006",
    products: [
        { productId: "P001", quantity: 2 },
        { productId: "P002", quantity: 1 }
    ],
    totalAmount: 49.99,
    orderDate: new Date("2024-02-17"),
    status: "Pending"
});

//order status update 
db.Order.updateOne(
    { orderId: "O004" },
    { $set: { status: "Shipped" } }
);

// fetch order for 1 customer 
db.Order.find(
    { customerId: "CU001" }
).pretty();




//2

//fetch all product with their category Id
db.Product.aggregate([

    {
        $lookup: {
            from: "Category",
            localField: "categoryId",
            foreignField: "categoryId",
            as: "categoryDetails"
        }
    }
]);

//total number of products per category 
db.Product.aggregate([
    {
        $group: {
            _id: "$categoryId",
            TotalProductsForEachCategory: { $sum: 1 }
        }
    }
]);

// top 5 most selled products 
db.Order.aggregate([
    { $unwind: "$products" },
    { $group: { _id: "$products.productId", TotalSold: { $sum: "$products.quantity" } } },
    { $sort: { TotalSold: -1 } },
    { $limit: 5 }
]);


//total revenue in specific month 
db.Order.aggregate([
    {
        $match: {
            orderDate: {
                $gte: ISODate("2025-02-01T00:00:00.000Z"),
                $lt: ISODate("2025-03-01T00:00:00.000Z")
            }
        }
    },
    {
        $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" }
        }
    }
]);

// List customers with total purchases

db.Order.aggregate([
    { $group: { _id: "$customerId", TotalSpent: { $sum: "$totalAmount" } } },
    {
        $lookup: {

            from: "Customer",
            localField: "_id",
            foreignField: "customerId",
            as: "CustomerDetails"
        }
    }
]);

//3

//creating index 

db.Order.createIndex({ "products.productId": 1 });


db.Order.createIndex({ "customerId": 1 });


db.Order.createIndex({ "orderDate": 1 });

//exists 
db.Product.findOne({ stock: { $exists: true } });

//type
db.Product.findOne({ price: { $type: "double" } });

// comparison and logical opereators 
db.Product.find({ "price": { $gt: 50 } });

db.Product.find({ "price": { $lt: 100 } });

db.Product.find({ "categoryId": { $eq: "Electronics" } });

db.Order.find({ "totalAmount": { $gte: 100 } });

db.Product.find({ "stock": { $lte: 10 } });

db.Customer.find({ "address": { $ne: "Mumbai" } });


db.Product.find({
    $and: [
        { "price": { $gt: 50 } },
        { "stock": { $lt: 20 } }
    ]
});


db.Customer.find({
    $or: [
        { "address": /Delhi/ },
        { "address": /Mumbai/ }
    ]
});


db.Product.find({ "price": { $not: { $eq: 100 } } });


db.Customer.find({
    $nor: [
        { "address": /Delhi/ },
        { "address": /Mumbai/ }
    ]
});

// Find the customer who placed the most orders.
db.Order.aggregate([
    {
        $unwind: "$products"
    },
    {
        $group:
            { _id: "$customerId", TotalOrders: { $sum: "$products.quantity" } }
    },
    {
        $lookup: {
            from: "Customer",
            localField: "_id",
            foreignField: "customerId",
            as: "CustomerDetails"
        }
    },
    { $unwind: "$CustomerDetails" },
    {
        $project: {
            _id: 1,
            CustomerName: "$CustomerDetails.name",
            TotalOrders: 1
        }
    }

])

// List all customers who have not placed any orders.

db.Customer.aggregate([
    {
        $lookup:
        {
            from: "Order",
            localField: "customerId",
            foreignField: "customerId",
            as: "OrderDetails"
        }
    }
    ,
    {
        $match: {
            "OrderDetails": { $size: 0 }
        }
    },
    {$project : { "OrderDetails" : 0}}
]);

//most frequent order product 
db.Order.aggregate([
    {$unwind : "$products"},
    {$group : { _id : "$products.productId" , TotalOrders : {$sum : "$products.quantity"} }},
    {$limit : 1}
  ])

//most spent money customer
db.Order.aggregate([
    { $group : { _id : "$customerId"  , TotalSpent : { $sum : "$totalAmount" } }}
  ])

//customer who have not placed order in 6 months 
db.Order.aggregate([
    {
      $lookup: {
        from: "Customer",
        localField: "customerId",
        foreignField: "customerId",
        as: "customer"
      }
    },
    {
      $match: {
  
        "customer.orderDate": { 
          $not: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } 
        }
      }
    }
  ]);

  //identify which month has highest stakes of value
  db.Order.aggregate([
    {$unwind : "$products"},
    { $group : { _id : { $month : "$orderDate" } , TotalSales : {$sum : "$products.quantity"} } } , 
      { $sort: { totalProductsSold: -1 } }, 
    { $limit: 1 }  
  ])

  //
  db.Order.aggregate([
    { $unwind: "$products" },  
    {
      $group: {
        _id: "$products.productId", 
        totalAdded: { $sum: "$products.quantity" }  
      }
    },
    { $sort: { totalAdded: -1 } },  
    { $limit: 5 }  
  ]);

  // MONGODUMP 
  --db ExamMongoDB --out "C:\Users\User 05\Desktop\DB BACKUP"

  // mongorestore 
  mongorestore --db ExamMongoDB "C:\Users\User 05\Desktop\DB BACKUP\ExamMongoDB"
