import React from "react";
import { useEffect, useState } from "react";
import api from "../services/api";

function StockList() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await api.get("/stocks");
        console.log(response.data.data);
        setStocks(response.data.data);
      } catch (err) {
        setError("Failed to load stocks");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  if (loading) return <p>Loading stocks...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛍️ Stock List</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {stocks.map((stock) => (
          <li
            key={stock.id}
            style={{
              background: "#f9f9f9",
              margin: "10px 0",
              padding: "10px 15px",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{stock.name}</h3>
            <p>💰 Price: ₹{stock.price}</p>
            <p>{stock.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StockList;
