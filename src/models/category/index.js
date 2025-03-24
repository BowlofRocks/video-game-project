import dbPromise from "../../db/index.js";

//This is moostly for the nav
const getCategories = async () => {
  const db = await dbPromise;
  const query = "SELECT * FROM categories";
  const result = await db.query(query);
  return result.rows; // Return the list of categories from the database
};

export { getCategories };
