import axios from "axios";
import Papa from "papaparse";

const parseCsv = (buffer) => {
  return new Promise((resolve, reject) => {
    const csvString = buffer.toString("utf8");
    Papa.parse(csvString, {
      header: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
};

const filterData = (data) => {
  return data.map((row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, value.toLowerCase()])));
};

const wait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const convertToJson = (data) => {
  return JSON.stringify(data);
};

const sendPostRequest = async (buffer) => {
  // Assuming 'buffer' is the buffer of your file
  const fileContent = buffer.toString("utf8"); // Convert buffer to string

  // Create a JSON payload with the file content
  const payload = {
    fileContent: fileContent,
  };

  try {
    console.log("Sending request with file content...");
    const response = await axios.post("https://nidhi.requestcatcher.com/test", payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error during POST request:", error.message);
    throw error;
  }
};

export { convertToJson, filterData, parseCsv, sendPostRequest, wait };
