ALTER TABLE books
ADD COLUMN user_id INT;

ALTER TABLE transactions
ADD COLUMN user_id INT;

-- Books → Users
ALTER TABLE books
ADD CONSTRAINT fk_books_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

-- Transactions → Users
ALTER TABLE transactions
ADD CONSTRAINT fk_transactions_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;


-- For Rollback
ALTER TABLE books
DROP CONSTRAINT fk_books_user;

ALTER TABLE transactions
DROP CONSTRAINT fk_transactions_user;

ALTER TABLE books
DROP COLUMN user_id;

ALTER TABLE transactions
DROP COLUMN user_id;

