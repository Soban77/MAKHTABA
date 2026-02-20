CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  discounted_price NUMERIC NOT NULL,
  actual_price NUMERIC NOT NULL,
  quantity INT NOT NULL
);

CREATE TABLE transactions (
    id BIGINT PRIMARY KEY,              
    type TEXT NOT NULL,                
    book_name TEXT NOT NULL,            
    quantity INT NOT NULL,              
    price NUMERIC(10,2) NOT NULL,      
    date DATE NOT NULL,                
    time TIME NOT NULL,                
    timestamp TIMESTAMP NOT NULL,       
    receipt TEXT                       
);
