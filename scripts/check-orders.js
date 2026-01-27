const { sql } = require("../lib/db");

async function checkOrders() {
  try {
    const result = await sql`SELECT COUNT(*) as total_orders FROM orders`;
    console.log("Total orders in database:", result[0].total_orders);
  } catch (error) {
    console.error("Error checking orders:", error);
  }
  process.exit();
}

checkOrders();
