import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableHead, TableBody, TableRow, TableCell, Typography } from "@mui/material";

function StatsPage() {
  const [stat, setStat] = useState([]);
  const codes = ["abcd1", "xyz123"]; // Demo: Replace with real codes

  useEffect(() => {
    Promise.all(codes.map(code => axios.get(`http://localhost:5000/shorturls/${code}`)))
      .then(res => setStat(res.map(r => r.data)));
  }, []);

  return (
    <div>
      <Typography variant="h5">Shortened URL Statistics</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Shortcode</TableCell>
            <TableCell>Original URL</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Expires At</TableCell>
            <TableCell>Clicks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stat.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{codes[idx]}</TableCell>
              <TableCell>{row.originalUrl}</TableCell>
              <TableCell>{row.createdAt}</TableCell>
              <TableCell>{row.expiresAt}</TableCell>
              <TableCell>{row.totalClicks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
export default StatsPage;
