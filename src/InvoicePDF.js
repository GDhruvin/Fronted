import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import SradhhaImg from "./Sraddha.png";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 20,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333333",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: "auto",
    width: 150,
    height: "auto",
  },
  table: {
    display: "table",
    width: "auto",
    margin: "10px 0",
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "solid",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeaderRow: {
    backgroundColor: "#f2f2f2",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 5,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    color: "#333333",
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#555555",
  },
  value: {
    fontSize: 12,
    marginTop: 2,
    color: "#333333",
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "right",
    color: "#000000",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  cell: {
    flexDirection: "column",
  },
});

// Create Document Component
const InvoicePDF = ({ invoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Image style={styles.image} src={SradhhaImg} />
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.label}>
              Client Name:{" "}
              <Text style={styles.value}>{invoiceData.clientname}</Text>
            </Text>
            {/* <Text style={styles.value}>{invoiceData.clientname}</Text> */}
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.label}>
              Client Mobile Number:{" "}
              <Text style={styles.value}>{invoiceData.clientnumber}</Text>
            </Text>
            {/* <Text style={styles.value}>{invoiceData.clientnumber}</Text> */}
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.label}>
              Date: <Text style={styles.value}>{invoiceData.date}</Text>
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.label}>Bill From:</Text>
            <Text style={styles.value}>{invoiceData.billfrom}</Text>
          </View>
          <View style={{ marginLeft: 20, flex: 1 }}>
            <Text style={styles.label}>Bill To:</Text>
            <Text style={styles.value}>{invoiceData.billto}</Text>
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <View style={[styles.table, styles.tableHeaderRow]}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                Item
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                Quantity
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                Price
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                Total
              </Text>
            </View>
          </View>
        </View>
        {invoiceData.items.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.description}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.quantity}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.price}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.total}</Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.totalAmount}>
        Total Amount: {invoiceData.totalAmount}
      </Text>
    </Page>
  </Document>
);

export default InvoicePDF;
