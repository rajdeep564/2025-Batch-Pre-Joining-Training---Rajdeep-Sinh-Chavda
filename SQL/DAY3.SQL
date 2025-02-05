CREATE DATABASE Task_3;

use  Task_3;

CREATE TABLE Customer (
	CustomerID INT PRIMARY KEY IDENTITY(1,1),
	FirstName VARCHAR(50) NOT NULL,
	LastName VARCHAR(50) NOT NULL,
	Email VARCHAR(100) UNIQUE,
	Phone VARCHAR(20)
);

CREATE TABLE PRODUCT(
	ProductID INT PRIMARY KEY IDENTITY(1,1),
	Name VARCHAR(100) NOT NULL,
	Price DECIMAL(10,2) NOT NULL,
	Description TEXT
);

CREATE TABLE Orders(
	OrderID INT PRIMARY KEY IDENTITY(1,1),
	CustomerID INT FOREIGN KEY REFERENCES Customer(CustomerID),
	OrderDate DATETIME NOT NULL,
	Rate DECIMAL(10,2) NOT NULL,
	Qty INT NOT NULL,
	TotalAmount DECIMAL(10,2) NOT NULL,
	ProductID INT FOREIGN KEY REFERENCES Product(ProductID)
);

CREATE TABLE Payment(
	PaymentID INT PRIMARY KEY IDENTITY(1,1),
	OrderID INT FOREIGN KEY REFERENCES Orders(OrderID),
	Amount DECIMAL(10,2) NOT NULL,
    PaymentDate DATETIME NOT NULL
);


INSERT INTO Customer (FirstName, LastName, Email, Phone)
VALUES 
('John', 'Doe', 'john.doe@example.com', '123-456-7890'),
('Jane', 'Smith', 'jane.smith@example.com', '987-654-3210'),
('Alice', 'Johnson', 'alice.johnson@example.com', '555-555-5555');


INSERT INTO Product (Name, Price, Description)
VALUES 
('Laptop', 1200.00, 'High-performance laptop'),
('Smartphone', 800.00, 'Latest model smartphone'),
('Tablet', 500.00, 'Lightweight and portable tablet');

INSERT INTO Orders (CustomerID, OrderDate, Qty, Rate, TotalAmount, ProductID)
VALUES 
(1, '2023-10-01 10:00:00', 1, 1200.00, 1200.00, 1),
(2, '2023-10-02 11:00:00', 2, 800.00, 1600.00, 2),
(3, '2023-10-03 12:00:00', 1, 500.00, 500.00, 3);

INSERT INTO Payment (OrderID, Amount, PaymentDate)
VALUES 
(1, 1200.00, '2023-10-01 10:30:00'),
(2, 1600.00, '2023-10-02 11:30:00'),
(3, 500.00, '2023-10-03 12:30:00');


--task - 1 - customer

CREATE PROCEDURE usp_task_1_c(
    @FirstName VARCHAR(50), 
    @LastName VARCHAR(50), 
    @Email VARCHAR(100), 
    @Phone VARCHAR(20))
AS
BEGIN
    INSERT INTO Customer (FirstName, LastName, Email, Phone)
    VALUES (@FirstName, @LastName, @Email, @Phone);
END;

EXECUTE usp_task_1_c
    'Jane', 
    'Smith', 
    'janesmith@example.com', 
    '9876543210';

--task - 1 - product

CREATE PROCEDURE usp_task_1_p(
    @Name VARCHAR(100), 
    @Price DECIMAL(10,2), 
    @Description TEXT)
AS
BEGIN
    INSERT INTO Product (Name, Price, Description)
    VALUES (@Name, @Price, @Description);
END;

EXECUTE usp_task_1_p
	'Iphone 15 pro',
	99000,
	'latest iphone';

--task - 1 - order

CREATE PROCEDURE usp_task_1_o(
    @CustomerID INT, 
    @OrderDate DATETIME, 
    @Rate DECIMAL(10,2), 
    @Qty INT, 
    @ProductID INT)
AS
BEGIN
    DECLARE @TotalAmount DECIMAL(10,2);
    SET @TotalAmount = @Rate * @Qty;
    
    INSERT INTO Orders (CustomerID, OrderDate, Rate, Qty, TotalAmount, ProductID)
    VALUES (@CustomerID, @OrderDate, @Rate, @Qty, @TotalAmount, @ProductID);
END;

EXECUTE usp_task_1_o
	'1',
	'12-12-2024',
	30,
	2,
	1;

--SELECT * FROM Orders;

--task - 1 - payments

CREATE PROCEDURE usp_task_1_pa(
    @OrderID INT, 
    @Amount DECIMAL(10,2), 
    @PaymentDate DATETIME)
AS
BEGIN
    INSERT INTO Payment (OrderID, Amount, PaymentDate)
    VALUES (@OrderID, @Amount, @PaymentDate);
END;

EXECUTE usp_task_1_pa
	1,
	100.30,
	'03-05-2024';

--SELECT * FROM Payment;

-- task - 2 - customer 

CREATE PROCEDURE usp_task_2_c(
    @CustomerID INT,
    @FirstName VARCHAR(50), 
    @LastName VARCHAR(50), 
    @Email VARCHAR(100), 
    @Phone VARCHAR(20))
AS
BEGIN
    UPDATE Customer
    SET FirstName = @FirstName, LastName = @LastName, Email = @Email, Phone = @Phone
    WHERE CustomerID = @CustomerID;
END;

EXECUTE usp_task_2_c
	1,  
    'Michael',  
    'Scott',  
    'michael.scott@example.com',  
    '9876543210';

-- task - 2 - product

CREATE PROCEDURE usp_task_2_p(
    @ProductID INT,
    @Name VARCHAR(100), 
    @Price DECIMAL(10,2), 
    @Description TEXT)
AS
BEGIN
    UPDATE Product
    SET Name = @Name, Price = @Price, Description = @Description
    WHERE ProductID = @ProductID;
END;

EXECUTE usp_task_2_p
	1,
	'Laptop Pro',
	1299.99,
	'High-performance laptop with latest processor and SSD storage.';

-- task - 2 - Orders

CREATE PROCEDURE usp_task_2_o(
    @OrderID INT,
    @CustomerID INT, 
    @OrderDate DATETIME, 
    @Rate DECIMAL(10,2), 
    @Qty INT, 
    @ProductID INT)
AS
BEGIN
    DECLARE @TotalAmount DECIMAL(10,2);
    SET @TotalAmount = @Rate * @Qty;

    UPDATE Orders
    SET CustomerID = @CustomerID, OrderDate = @OrderDate, Rate = @Rate, Qty = @Qty, TotalAmount = @TotalAmount, ProductID = @ProductID
    WHERE OrderID = @OrderID;
END;

EXECUTE usp_task_2_o 
    1,  
    2,  
    '2025-02-05',  
    100.00,  
    5,  
    3;  

-- task - 2 - payments

CREATE PROCEDURE usp_task_2_pa(
    @PaymentID INT,
    @OrderID INT, 
    @Amount DECIMAL(10,2), 
    @PaymentDate DATETIME)
AS
BEGIN
    UPDATE Payment
    SET OrderID = @OrderID, Amount = @Amount, PaymentDate = @PaymentDate
    WHERE PaymentID = @PaymentID;
END;

EXECUTE usp_task_2_pa 
    1,  
    2, 
    150.75,  
    '2025-02-05';

-- task - 3 - customer 
CREATE PROCEDURE usp_task_3_c
AS
BEGIN
    SELECT * FROM Customer;
END;

-- task - 3 - product 
CREATE PROCEDURE usp_task_3_p
AS
BEGIN
    SELECT * FROM Product;
END;

-- task - 3 - orders 
CREATE PROCEDURE usp_task_3_o
AS
BEGIN
    SELECT * FROM Orders;
END;

-- task - 3 - payments 
CREATE PROCEDURE usp_task_3_pa
AS
BEGIN
    SELECT * FROM Payment;
END;

EXECUTE usp_task_3_pa;

--task - 4 - customer
CREATE PROCEDURE usp_task_4_c
    @CustomerID INT
AS
BEGIN
    DELETE FROM Customer WHERE CustomerID = @CustomerID;
END;

--task - 4 - product
CREATE PROCEDURE usp_task_4_p
    @ProductID INT
AS
BEGIN
    DELETE FROM Product WHERE ProductID = @ProductID;
END;

--task - 4 - order
CREATE PROCEDURE usp_task_4_o
    @OrderID INT
AS
BEGIN
    DELETE FROM Orders WHERE OrderID = @OrderID;
END;

--task - 4 - payments
CREATE PROCEDURE usp_task_4_pa
    @PaymentID INT
AS
BEGIN
    DELETE FROM Payment WHERE PaymentID = @PaymentID;
END;

EXECUTE usp_task_4_pa
	2;

-- task - 5 

CREATE PROCEDURE usp_task_5(
    @ProductID INT, 
    @NewPrice DECIMAL(10,2))
AS
BEGIN
    UPDATE Product
    SET Price = @NewPrice
    WHERE ProductID = @ProductID;
END;

select * from PRODUCT;
EXECUTE usp_task_5
	1,
	400;
select * from PRODUCT;

-- task - 6
CREATE PROCEDURE usp_task_6(
    @CustomerID INT, 
    @OrderDate DATETIME, 
    @ProductID INT, 
    @Qty INT, 
    @Rate DECIMAL(10,2))
AS
BEGIN
    DECLARE @TotalAmount DECIMAL(10,2);
    SET @TotalAmount = @Rate * @Qty;

    INSERT INTO Orders (CustomerID, OrderDate, Rate, Qty, TotalAmount, ProductID)
    VALUES (@CustomerID, @OrderDate, @Rate, @Qty, @TotalAmount, @ProductID);
END;

select * from Orders;
EXECUTE usp_task_6
	1,
	'10-10-2022',
	1,
	3,
	9000;
select * from Orders;

-- task - 7
CREATE PROCEDURE usp_task_7(
    @OrderID INT, 
    @Amount DECIMAL(10,2))
AS
BEGIN
    INSERT INTO Payment (OrderID, Amount, PaymentDate)
    VALUES (@OrderID, @Amount, GETDATE());
END;

select * from Payment;
EXECUTE usp_task_7
	3,
	8900;
select * from Payment;

--task - 8
CREATE PROCEDURE usp_task_8
AS 
BEGIN
	SELECT c.CustomerID , SUM(p.Amount) as [Total amount by customer]
	FROM Customer c
	JOIN Orders o
	ON c.CustomerID = o.CustomerID
	JOIN Payment p
	ON p.OrderID = o.OrderID
	GROUP BY c.CustomerID
	ORDER BY c.CustomerID;
END;

EXECUTE usp_task_8


DROP PROCEDURE usp_task_8;


-- TASK - 9 
CREATE PROCEDURE usp_task_9
AS 
BEGIN 
	SELECT c.CustomerID
	FROM Customer c
	LEFT JOIN Orders o
	ON c.CustomerID = o.CustomerID
	LEFT JOIN Payment p
	ON o.OrderID = p.OrderID
	WHERE p.OrderID IS NULL;
END;

EXECUTE usp_task_9;

DROP PROCEDURE usp_task_9;

-- TASK - 10

CREATE PROCEDURE usp_task_10(
    @StartDate DATETIME,
    @EndDate DATETIME)
AS
BEGIN
    SELECT SUM(TotalAmount) AS TotalRevenue
    FROM Orders
    WHERE OrderDate BETWEEN @StartDate AND @EndDate;
END;

EXECUTE usp_task_10
	'01-01-2020',
	'01-01-2026';

-- TASK - 11
CREATE PROCEDURE usp_task_11
AS
BEGIN
    SELECT 
        o.OrderID, 
        o.OrderDate, 
        o.Rate, 
        o.Qty, 
        o.TotalAmount, 
        c.CustomerID, 
        c.FirstName, 
        c.LastName, 
        c.Email, 
        c.Phone, 
        p.ProductID, 
        p.Name AS ProductName, 
        p.Price AS ProductPrice, 
        p.Description AS ProductDescription
    FROM 
        Orders o
    INNER JOIN 
        Customer c ON o.CustomerID = c.CustomerID
    INNER JOIN 
        Product p ON o.ProductID = p.ProductID;
END;

EXECUTE usp_task_11;

--TASK - 12

CREATE PROCEDURE usp_task_12
    @TopN INT  -- 
AS
BEGIN
    SELECT TOP (@TopN)
        c.CustomerID,
        c.FirstName,
        c.LastName,
        c.Email,
        c.Phone,
        SUM(p.Amount) AS TotalPayments
    FROM 
        Customer c
	LEFT JOIN
		Orders o ON o.CustomerID = c.CustomerID
	JOIN 
        Payment p ON o.OrderID = p.OrderID	
    GROUP BY 
        c.CustomerID, c.FirstName, c.LastName, c.Email, c.Phone
    ORDER BY 
        TotalPayments DESC;
END;

DROP PROCEDURE usp_task_12;

EXECUTE usp_task_12
	10;

--TASK - 13 
ALTER PROCEDURE usp_task_13
    @MonthsAgo INT  
AS
BEGIN
    SELECT 
        o.OrderID,
        o.OrderDate,
        o.Rate,
        o.Qty,
        o.TotalAmount,
        c.CustomerID,
        c.FirstName,
        c.LastName,
        c.Email,
        c.Phone,
        p.PaymentID,
        p.Amount AS PaymentAmount,
        p.PaymentDate
    FROM 
        Customer c
    JOIN 
        Orders o ON o.CustomerID = c.CustomerID
    JOIN 
        Payment p ON o.OrderID = p.OrderID
    WHERE 
        p.PaymentDate >= CAST(DATEADD(MONTH, -@MonthsAgo, GETDATE()) AS DATE)  -- Fix: Remove time from GETDATE()
    ORDER BY 
        p.PaymentDate DESC;
END;



EXECUTE usp_task_13
	2;

DROP PROCEDURE usp_task_13;

--TASK - 14
ALTER TABLE Product
ADD Category VARCHAR(50) NOT NULL DEFAULT 'Uncategorized';

UPDATE Product 
SET Category = 
    CASE 
        WHEN Name LIKE '%Laptop%' OR Name LIKE '%Phone%' THEN 'Electronics'
        ELSE 'Other'
    END;

ALTER PROCEDURE usp_task_14
AS
BEGIN
    SELECT 
        p.Category,
        SUM(o.TotalAmount) AS TotalRevenue
    FROM 
        Orders o
    JOIN 
        Product p ON o.ProductID = p.ProductID
    GROUP BY 
        p.Category
    ORDER BY 
        TotalRevenue DESC;
END;

EXECUTE usp_task_14

--task - 15
ALTER PROCEDURE usp_task_15
AS
BEGIN
    SELECT TOP 1
        p.ProductID,
        p.Name AS ProductName,
        SUM(o.TotalAmount) AS TotalRevenue
    FROM 
        Orders o
    JOIN 
        Product p ON o.ProductID = p.ProductID
    GROUP BY 
        p.ProductID, p.Name
    ORDER BY 
        TotalRevenue DESC;
END;

EXECUTE usp_task_15;

CREATE PROCEDURE usp_task_16
    @ProductID INT,  
    @StartDate DATETIME,  
    @EndDate DATETIME  
AS
BEGIN
    SELECT 
        c.CustomerID,
        c.FirstName,
        c.LastName,
        c.Email,
        c.Phone,
        o.OrderID,
        o.OrderDate,
        p.Name AS ProductName,
        o.Qty,
        o.TotalAmount
    FROM 
        Customer c
    JOIN 
        Orders o ON c.CustomerID = o.CustomerID
    JOIN 
        Product p ON o.ProductID = p.ProductID
    WHERE 
        o.ProductID = @ProductID
        AND o.OrderDate BETWEEN @StartDate AND @EndDate
    ORDER BY 
        o.OrderDate DESC;
END;

EXEC usp_task_16 
	1, 
	'2024-01-01',  
	'2025-02-01';

CREATE PROCEDURE usp_task_17
AS
BEGIN
    SELECT 
        c.CustomerID,
        c.FirstName,
        c.LastName,
        c.Email,
        c.Phone,
        COUNT(o.OrderID) AS TotalOrders,
        SUM(o.TotalAmount) AS TotalSpent,
        AVG(o.TotalAmount) AS AverageOrderValue
    FROM 
        Customer c
    JOIN 
        Orders o ON c.CustomerID = o.CustomerID
    GROUP BY 
        c.CustomerID, c.FirstName, c.LastName, c.Email, c.Phone
    ORDER BY 
        AverageOrderValue DESC; -- Sorting by highest average order value
END;

EXEC usp_task_17;

ALTER PROCEDURE usp_task_18
AS
BEGIN
    SELECT 
        o.OrderID,
        o.CustomerID,
        c.FirstName,
        c.LastName,
        c.Email,
        c.Phone,
        o.OrderDate,
        o.TotalAmount
    FROM 
        Orders o
    JOIN 
        Customer c ON o.CustomerID = c.CustomerID
    WHERE 
        o.TotalAmount = (SELECT MAX(TotalAmount) 
                         FROM Orders 
                         WHERE CustomerID = o.CustomerID)
	ORDER BY o.TotalAmount DESC;
END;

EXEC usp_task_18;

CREATE PROCEDURE usp_task_19
    @Year INT
AS
BEGIN
    SELECT 
        c.CustomerID,
        c.FirstName,
        c.LastName,
        c.Email,
        c.Phone,
        COUNT(o.OrderID) AS TotalOrders,
        SUM(o.TotalAmount) AS TotalRevenue
    FROM 
        Customer c
    JOIN 
        Orders o ON c.CustomerID = o.CustomerID
    WHERE 
        YEAR(o.OrderDate) = @Year
    GROUP BY 
        c.CustomerID, c.FirstName, c.LastName, c.Email, c.Phone
    ORDER BY 
        TotalRevenue DESC;
END;

EXEC usp_task_19
	2024;

CREATE PROCEDURE usp_task_20
    @Months INT
AS
BEGIN
    SELECT 
        o.OrderID,
        o.CustomerID,
        c.FirstName,
        c.LastName,
        c.Email,
        c.Phone,
        o.OrderDate,
        o.TotalAmount
    FROM 
        Orders o
    JOIN 
        Customer c ON o.CustomerID = c.CustomerID
    LEFT JOIN 
        Payment p ON o.OrderID = p.OrderID
    WHERE 
        p.PaymentID IS NULL
        AND DATEDIFF(MONTH, o.OrderDate, GETDATE()) >= @Months
    ORDER BY 
        o.OrderDate ASC;
END;

EXEC usp_task_20 
	3;  

CREATE PROCEDURE usp_task_21
    @Months INT
AS
BEGIN
    SELECT 
        o1.OrderID AS Order1_ID,
        o1.OrderDate AS Order1_Date,
        o1.TotalAmount AS Order1_TotalAmount,
        o2.OrderID AS Order2_ID,
        o2.OrderDate AS Order2_Date,
        o2.TotalAmount AS Order2_TotalAmount,
        c.CustomerID,
        c.FirstName,
        c.LastName,
        c.Email,
        c.Phone
    FROM 
        Orders o1
    JOIN 
        Orders o2 ON o1.CustomerID = o2.CustomerID
    JOIN 
        Customer c ON o1.CustomerID = c.CustomerID
    WHERE 
        o1.OrderID <> o2.OrderID
        AND DATEDIFF(MONTH, o1.OrderDate, o2.OrderDate) <= @Months
    ORDER BY 
        c.CustomerID, o1.OrderDate;
END;

EXEC usp_task_21
	2;  

CREATE PROCEDURE usp_task_22
    @Months INT
AS
BEGIN
    SELECT 
        c.CustomerID,
        c.FirstName,
        c.LastName,
        c.Email,
        c.Phone,
        SUM(o.TotalAmount) AS TotalRevenue
    FROM 
        Orders o
    JOIN 
        Customer c ON o.CustomerID = c.CustomerID
    WHERE 
        o.OrderDate >= DATEADD(MONTH, -@Months, GETDATE())
    GROUP BY 
        c.CustomerID, c.FirstName, c.LastName, c.Email, c.Phone
    ORDER BY 
        TotalRevenue DESC;
END;

EXEC usp_task_22
	2;

ALTER PROCEDURE usp_task_23
AS
BEGIN
    DECLARE @AvgPrice DECIMAL(10,2);

    -- Calculate the average price of all products
    SELECT @AvgPrice = AVG(Price) FROM Product;

    -- Retrieve orders where the product price is higher than the average
    SELECT 
        o.OrderID,
        o.OrderDate,
        o.TotalAmount,
        p.ProductID,
        p.Name AS ProductName,
        p.Price AS ProductPrice
    FROM 
        Orders o
    JOIN 
        Product p ON o.ProductID = p.ProductID
    WHERE 
        p.Price > @AvgPrice
    ORDER BY 
        o.OrderDate DESC;
END;

exec usp_task_23;

CREATE PROCEDURE usp_task_24
AS
BEGIN
    WITH OrderDifferences AS (
        SELECT 
            o1.CustomerID,
            DATEDIFF(DAY, o1.OrderDate, o2.OrderDate) AS DaysBetween
        FROM 
            Orders o1
        JOIN 
            Orders o2 ON o1.CustomerID = o2.CustomerID AND o1.OrderID < o2.OrderID
    )
    SELECT 
        CustomerID,
        AVG(DaysBetween) AS AvgDaysBetweenOrders
    FROM 
        OrderDifferences
    GROUP BY 
        CustomerID
    ORDER BY 
        AvgDaysBetweenOrders;
END;

EXEC usp_task_24;

CREATE PROCEDURE usp_task_25
    @PageNumber INT,
    @PageSize INT,
    @SortColumn NVARCHAR(50) = 'OrderDate',  -- Default sorting by OrderDate
    @SortOrder NVARCHAR(4) = 'ASC',  -- Default sorting in ascending order
    @SearchTerm NVARCHAR(100) = NULL  -- Search term for filtering orders
AS
BEGIN
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    DECLARE @SQL NVARCHAR(MAX);
    
    SET @SQL = N'
        SELECT 
            o.OrderID,
            o.OrderDate,
            o.TotalAmount,
            o.CustomerID,
            c.FirstName,
            c.LastName,
            c.Email,
            c.Phone
        FROM 
            Orders o
        JOIN 
            Customer c ON o.CustomerID = c.CustomerID
        WHERE 
            (@SearchTerm IS NULL OR c.FirstName LIKE ''%' + @SearchTerm + '%'' OR c.LastName LIKE ''%' + @SearchTerm + '%'' OR o.OrderID LIKE ''%' + @SearchTerm + '%'' )
        ORDER BY ' + @SortColumn + ' ' + @SortOrder + '
        OFFSET @Offset ROWS
        FETCH NEXT @PageSize ROWS ONLY;
    ';
    
    EXEC sp_executesql @SQL, N'@Offset INT, @PageSize INT', @Offset, @PageSize;
END;


SELECT * FROM Customer;
SELECT * FROM PRODUCT;
SELECT * FROM Orders;
SELECT * FROM Payment;
