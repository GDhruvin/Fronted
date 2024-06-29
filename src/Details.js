import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import TodayIcon from "@mui/icons-material/Today";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { LoadingButton } from "@mui/lab";
import { UpdateEntry, addNewEntry, enties, totalValue } from "./config/config";

const defaultValues = {
  sarin: "",
  inclu: "",
  aq: "",
  fourP: "",
  galaxy4p: "",
  ls: "",
};

const schema = yup.object().shape({
  sarin: yup.string().required("Sarin is Required"),
  inclu: yup.string().required("Inclu is Required"),
  aq: yup.string().required("AQ is Required"),
  fourP: yup.string().required("4P is Required"),
  galaxy4p: yup.string().required("Galaxy 4P is Required"),
  ls: yup.string().required("ls is Required"),
});

function Details() {
  const { handleSubmit, control, formState, reset, setValue } = useForm({
    defaultValues,
    mode: "all",
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  const location = useLocation();
  const navigate = useNavigate();
  const data = location?.state;
  const [openModal, setOpenModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [lastMonth, setLastMonth] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("DD-MM-YYYY")
  );
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [totals, setTotals] = useState({
    totalsarin: 0,
    totalinclue: 0,
    totalaq: 0,
    totalfourp: 0,
    totalgalexy: 0,
    totalls: 0,
  });
  const [pricetotal, setPriceTotal] = useState({
    numbersarin: totals.totalsarin,
    numberinclue: totals.totalinclue,
    numberaq: totals.totalaq,
    numberfourp: totals.totalfourp,
    numbergalexy: totals.totalgalexy,
    numberls: totals.totalls,
  });
  const [priceData, setPriceData] = useState({
    defaultpricesarin: 2,
    defaultpriceinclue: 2,
    defaultpriceaq: 4.5,
    defaultpricefourp: 5.5,
    defaultpricegalexy: 6.5,
    defaultpricels: 6,
  });
  const [priceMulti, setPriceMulti] = useState({
    mutlisarin: priceData.defaultpricesarin * pricetotal.numbersarin,
    mutliinclue: priceData.defaultpriceinclue * pricetotal.numberinclue,
    mutliaq: priceData.defaultpriceaq * pricetotal.numberaq,
    mutlifourp: priceData.defaultpricefourp * pricetotal.numberfourp,
    mutligalexy: priceData.defaultpricegalexy * pricetotal.numbergalexy,
    mutlils: priceData.defaultpricels * pricetotal.numberls,
  });
  const [openBill, setOpenBill] = useState(false);

  const handleInputChangepricedefault = (e) => {
    const { name, value } = e.target;
    setPriceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChangepricetotal = (e) => {
    const { name, value } = e.target;
    setPriceTotal((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChangepriceMulti = (e) => {
    const { name, value } = e.target;
    setPriceMulti((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    setPriceMulti({
      numbersarin: totals.totalsarin,
      numberinclue: totals.totalinclue,
      numberaq: totals.totalaq,
      numberfourp: totals.totalfourp,
      numbergalexy: totals.totalgalexy,
      numberls: totals.totalls,
    });
    setPriceMulti({
      mutlisarin: priceData.defaultpricesarin * pricetotal.numbersarin,
      mutliinclue: priceData.defaultpriceinclue * pricetotal.numberinclue,
      mutliaq: priceData.defaultpriceaq * pricetotal.numberaq,
      mutlifourp: priceData.defaultpricefourp * pricetotal.numberfourp,
      mutligalexy: priceData.defaultpricegalexy * pricetotal.numbergalexy,
      mutlils: priceData.defaultpricels * pricetotal.numberls,
    });
    // eslint-disable-next-line
  }, [priceData, pricetotal]);

  useEffect(() => {
    setPriceTotal({
      numbersarin: totals.totalsarin,
      numberinclue: totals.totalinclue,
      numberaq: totals.totalaq,
      numberfourp: totals.totalfourp,
      numbergalexy: totals.totalgalexy,
      numberls: totals.totalls,
    });
  }, [totals]);

  const handleBilling = () => {
    setOpenBill(true);
  };

  const handleCloseBilling = () => {
    setOpenBill(false);
    setPriceTotal({
      numbersarin: totals.totalsarin,
      numberinclue: totals.totalinclue,
      numberaq: totals.totalaq,
      numberfourp: totals.totalfourp,
      numbergalexy: totals.totalgalexy,
      numberls: totals.totalls,
    });
    setPriceData({
      defaultpricesarin: 2,
      defaultpriceinclue: 2,
      defaultpriceaq: 4.5,
      defaultpricefourp: 5.5,
      defaultpricegalexy: 6.5,
      defaultpricels: 6,
    });
  };

  const billDownload = () => {};

  const invoiceData = {
    clientname: data.name,
    clientnumber: data.mobile,
    date: moment().format("DD-MM-YYYY"),
    billfrom: tableData[0]?.date,
    billto: tableData[tableData.length - 1]?.date,
    items: [
      {
        description: "SARIN",
        quantity: pricetotal.numbersarin,
        price: priceData.defaultpricesarin,
        total: priceMulti.mutlisarin,
      },
      {
        description: "INCLU",
        quantity: pricetotal.numberinclue,
        price: priceData.defaultpriceinclue,
        total: priceMulti.mutliinclue,
      },
      {
        description: "AQ",
        quantity: pricetotal.numberaq,
        price: priceData.defaultpriceaq,
        total: priceMulti.mutliaq,
      },
      {
        description: "4P",
        quantity: pricetotal.numberfourp,
        price: priceData.defaultpricefourp,
        total: priceMulti.mutlifourp,
      },
      {
        description: "GALAXY 4P",
        quantity: pricetotal.numbergalexy,
        price: priceData.defaultpricegalexy,
        total: priceMulti.mutligalexy,
      },
      {
        description: "LS",
        quantity: pricetotal.numberls,
        price: priceData.defaultpricels,
        total: priceMulti.mutlils,
      },
    ],
    totalAmount: `${
      priceMulti.mutlisarin +
      priceMulti.mutliinclue +
      priceMulti.mutliaq +
      priceMulti.mutlifourp +
      priceMulti.mutligalexy +
      priceMulti.mutlils
    }/-`,
  };
  const lastMonthNumeric = moment().subtract(1, "months").month() + 1;

  const handleExpandClick = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleChangeDate = (newDate) => {
    if (newDate && newDate.isValid()) {
      const formattedDate = newDate.format("DD-MM-YYYY");
      setSelectedDate(formattedDate);
      setSelectedMonth(newDate.month() + 1);
    }
  };

  const handleGetData = (data) => {
    Swal.fire({
      title: "Loading",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    axios({
      method: "GET",
      url:
        enties +
        data.id +
        "/" +
        (lastMonth ? lastMonthNumeric : moment().month() + 1),
    })
      .then((response) => {
        if (response.status === 200) {
          Swal.close();
          if (response.status === 200) {
            setTableData(response.data);
          }
        } else {
          Swal.close();
          setTableData([]);
        }
      })
      .catch((_errors) => {
        Swal.close();
        setTableData([]);
      });
  };

  const handleGetTotalData = (data) => {
    Swal.fire({
      title: "Loading",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    axios({
      method: "GET",
      url:
        totalValue +
        data.id +
        "/" +
        (lastMonth ? lastMonthNumeric : moment().month() + 1),
    })
      .then((response) => {
        if (response.status === 200) {
          setTotals(response.data);
          Swal.close();
        } else {
          setTotals({
            totalsarin: 0,
            totalinclue: 0,
            totalaq: 0,
            totalfourp: 0,
            totalgalexy: 0,
            totalls: 0,
          });
          Swal.close();
        }
      })
      .catch((_errors) => {
        Swal.close();
        setTotals({
          totalsarin: 0,
          totalinclue: 0,
          totalaq: 0,
          totalfourp: 0,
          totalgalexy: 0,
          totalls: 0,
        });
      });
  };

  const updateEntry = (formData) => {
    setOpenUpdate(false);
    const mainData = {
      month: selectedMonth,
      date: selectedDate,
      sarin: formData.sarin,
      inclu: formData.inclu,
      aq: formData.aq,
      fourp: formData.fourP,
      galexy: formData.galaxy4p,
      ls: formData.ls,
    };
    Swal.fire({
      title: "Are you sure?",
      text: "Update the Entry's Details",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#e51616",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Loading",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });
        axios({
          method: "PATCH",
          url: UpdateEntry + updateData.id,
          data: mainData,
        })
          .then((response) => {
            Swal.close();
            if (response.status === 200) {
              Swal.fire({
                icon: "success",
                text: response.data.message,
                timer: 2000,
                showConfirmButton: false,
                allowOutsideClick: false,
                willClose: () => {
                  reset();
                  setOpenModal(false);
                  setOpenUpdate(false);
                  handleGetData(data);
                  setUpdateData(null);
                  handleGetTotalData(data);
                },
              });
            } else {
              Swal.close();
              Swal.fire({
                icon: "error",
                text: response.data.message,
              });
            }
          })
          .catch((_errors) => {
            Swal.close();
            Swal.fire({
              icon: "error",
              text: "Something goes wrong please try again..",
            });
          });
      } else {
        setOpenUpdate(true);
      }
    });
  };

  const handleEdit = (subrow, row) => {
    setOpenUpdate(true);
    setUpdateData(subrow);
    setSelectedDate(subrow.date);
    setSelectedMonth(subrow.month);
    setValue("sarin", subrow.sarin);
    setValue("inclu", subrow.inclu);
    setValue("aq", subrow.aq);
    setValue("fourP", subrow.fourp);
    setValue("galaxy4p", subrow.galexy);
    setValue("ls", subrow.ls);
  };

  useEffect(() => {
    if (data === null) {
      navigate("/");
    }
    handleGetData(data);
    handleGetTotalData(data);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (data === null) {
      navigate("/");
    }
    handleGetData(data);
    handleGetTotalData(data);
    // eslint-disable-next-line
  }, [lastMonth]);

  const handleBack = () => {
    navigate("/");
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setOpenUpdate(false);
    setUpdateData(null);
    reset();
    setSelectedDate(moment().format("DD-MM-YYYY"));
    setSelectedMonth(moment().month() + 1);
  };

  const onAddSubmit = (formData) => {
    const mainData = {
      createdBy: data.id,
      month: selectedMonth,
      date: selectedDate,
      sarin: formData.sarin,
      inclu: formData.inclu,
      aq: formData.aq,
      fourp: formData.fourP,
      galexy: formData.galaxy4p,
      ls: formData.ls,
    };
    setOpenModal(false);
    Swal.fire({
      title: "Loading",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    axios({
      method: "POST",
      url: addNewEntry,
      data: mainData,
    })
      .then((response) => {
        if (response.status === 200) {
          Swal.close();
          reset();
          Swal.fire({
            icon: "success",
            text: response.data.message,
            timer: 2000, // 2 seconds timer
            showConfirmButton: false, // Hide the confirmation button
            allowOutsideClick: false,
            willClose: () => {
              handleCloseModal();
              handleGetData(data);
              handleGetTotalData(data);
            },
          });
        } else {
          Swal.close();
          Swal.fire({
            icon: "error",
            text: response.data.message,
          });
        }
      })
      .catch((_errors) => {
        Swal.close();
        Swal.fire({
          icon: "error",
          text: "Something goes wrong please try again..",
        });
      });
  };

  return (
    <div className="h-full">
      {/* <div id="invoice-container">
        <BillGenerator />
      </div> */}

      <div className="bg-[#322f2f] h-20 flex justify-between fixed top-0 left-0 w-full z-10">
        <div>
          <img
            className="h-20 cursor-pointer"
            src="Sraddha.png"
            alt="Sraddha"
          />
        </div>
        <p className="text-2xl font-bold text-slate-200 my-4 uppercase">
          {data.name}
        </p>

        <div className="flex">
          <div className="mt-5 mr-4">
            <Button
              className="h-10"
              variant="contained"
              color="inherit"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              Back
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-[#ECECEC] px-11 py-3 mt-20 overflow-auto h-[calc(100%-5rem)]">
        <div className="flex justify-between mb-3 pl-5 items-center">
          <div>
            {!lastMonth && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                color="success"
                style={{ marginRight: "10px" }}
                onClick={handleOpenModal}
              >
                ADD Entry
              </Button>
            )}
            {lastMonth ? (
              <Button
                variant="contained"
                startIcon={<TodayIcon />}
                onClick={() => setLastMonth(!lastMonth)}
              >
                Current Month
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<TodayIcon />}
                onClick={() => setLastMonth(!lastMonth)}
              >
                Last Month
              </Button>
            )}
          </div>
          <div className="flex">
            <Button
              variant="contained"
              sx={{ marginRight: "10px" }}
              startIcon={<CurrencyRupeeIcon />}
              onClick={() => handleBilling()}
            >
              Billing
            </Button>
            <Typography variant="h5" gutterBottom>
              Month :{" "}
              {lastMonth
                ? moment().subtract(1, "months").format("MMMM")
                : moment().format("MMMM")}
            </Typography>
          </div>
        </div>
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Grid container spacing={2} justifyContent="space-between">
                <Grid item>
                  <Card
                    sx={{
                      backgroundColor: "#8d637b",
                      borderRadius: 2,
                      boxShadow: 3,
                      width: 200,
                      height: 150,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="div"
                        gutterBottom
                        sx={{ fontWeight: "bold" }}
                      >
                        Total Sarin
                      </Typography>
                      <Typography variant="h4" component="div">
                        {totals.totalsarin}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item>
                  <Card
                    sx={{
                      backgroundColor: "#ffb300",
                      borderRadius: 2,
                      boxShadow: 3,
                      width: 200,
                      height: 150,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="div"
                        gutterBottom
                        sx={{ fontWeight: "bold" }}
                      >
                        Total Inclue
                      </Typography>
                      <Typography variant="h4" component="div">
                        {totals.totalinclue}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item>
                  <Card
                    sx={{
                      backgroundColor: "#5c6bc0",
                      borderRadius: 2,
                      boxShadow: 3,
                      width: 200,
                      height: 150,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="div"
                        gutterBottom
                        sx={{ fontWeight: "bold" }}
                      >
                        Total AQ
                      </Typography>
                      <Typography variant="h4" component="div">
                        {totals.totalaq}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item>
                  <Card
                    sx={{
                      backgroundColor: "#e91e63",
                      borderRadius: 2,
                      boxShadow: 3,
                      width: 200,
                      height: 150,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="div"
                        gutterBottom
                        sx={{ fontWeight: "bold" }}
                      >
                        Total 4P
                      </Typography>
                      <Typography variant="h4" component="div">
                        {totals.totalfourp}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item>
                  <Card
                    sx={{
                      backgroundColor: "#9ccc65",
                      borderRadius: 2,
                      boxShadow: 3,
                      width: 200,
                      height: 150,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="div"
                        gutterBottom
                        sx={{ fontWeight: "bold" }}
                      >
                        Total Galaxy-4P
                      </Typography>
                      <Typography variant="h4" component="div">
                        {totals.totalgalexy}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item>
                  <Card
                    sx={{
                      backgroundColor: "#607d8b",
                      borderRadius: 2,
                      boxShadow: 3,
                      width: 200,
                      height: 150,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="div"
                        gutterBottom
                        sx={{ fontWeight: "bold" }}
                      >
                        Total LS
                      </Typography>
                      <Typography variant="h4" component="div">
                        {totals.totalls}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        {tableData.length !== 0 && (
          <div className="">
            <TableContainer component={Paper} sx={{ maxHeight: 390 }}>
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHead
                  className="bg-teal-800"
                  style={{ position: "sticky", top: "0", zIndex: "1" }}
                >
                  <TableRow>
                    <TableCell
                      className="text-xs uppercase tracking-wider"
                      sx={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {" "}
                    </TableCell>
                    <TableCell
                      className="text-xs uppercase tracking-wider"
                      sx={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      DATE
                    </TableCell>
                    <TableCell
                      className="text-xs uppercase tracking-wider"
                      sx={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      SARIN
                    </TableCell>
                    <TableCell
                      className="text-xs uppercase tracking-wider"
                      sx={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      INCLU
                    </TableCell>
                    <TableCell
                      className="text-xs uppercase tracking-wider"
                      sx={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      AQ
                    </TableCell>
                    <TableCell
                      className="text-xs uppercase tracking-wider"
                      sx={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      4P
                    </TableCell>
                    <TableCell
                      className="text-xs uppercase tracking-wider"
                      sx={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      GALAXY 4P
                    </TableCell>
                    <TableCell
                      className="text-xs uppercase tracking-wider"
                      sx={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      LS
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {tableData.map((row, index) => (
                    <React.Fragment key={index}>
                      <TableRow
                        className="hover:bg-gray-100"
                        sx={{
                          "&:hover": {
                            backgroundColor: "#f0f0f0",
                          },
                        }}
                      >
                        <TableCell
                          className="text-xs uppercase tracking-wider"
                          sx={{ textAlign: "center" }}
                        >
                          <IconButton
                            onClick={() => handleExpandClick(index)}
                            aria-expanded={expandedRow === index}
                          >
                            {expandedRow === index ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell
                          className="text-xs uppercase tracking-wider"
                          sx={{ textAlign: "center" }}
                        >
                          {row.date ? row.date : "-"}
                        </TableCell>
                        <TableCell
                          className="text-xs uppercase tracking-wider"
                          sx={{ textAlign: "center" }}
                        >
                          {row.totalsarin ? row.totalsarin : "-"}
                        </TableCell>
                        <TableCell
                          className="text-xs uppercase tracking-wider"
                          sx={{ textAlign: "center" }}
                        >
                          {row.totalinclue ? row.totalinclue : "-"}
                        </TableCell>
                        <TableCell
                          className="text-xs uppercase tracking-wider"
                          sx={{ textAlign: "center" }}
                        >
                          {row.aq ? row.aq : "-"}
                        </TableCell>
                        <TableCell
                          className="text-xs uppercase tracking-wider"
                          sx={{ textAlign: "center" }}
                        >
                          {row.fourp ? row.fourp : "-"}
                        </TableCell>
                        <TableCell
                          className="text-xs uppercase tracking-wider"
                          sx={{ textAlign: "center" }}
                        >
                          {row.galexy ? row.galexy : "-"}
                        </TableCell>
                        <TableCell
                          className="text-xs uppercase tracking-wider"
                          sx={{ textAlign: "center" }}
                        >
                          {row.ls ? row.ls : "-"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={8}
                        >
                          <Collapse
                            in={expandedRow === index}
                            timeout="auto"
                            unmountOnExit
                            sx={{
                              backgroundColor: "#f0f0f0",
                            }}
                          >
                            <Box margin={2}>
                              <Table size="small" aria-label="subentries">
                                <TableHead className="bg-teal-800">
                                  <TableRow>
                                    <TableCell
                                      className="text-xs uppercase tracking-wider"
                                      sx={{
                                        textAlign: "center",
                                        color: "white",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Date
                                    </TableCell>
                                    <TableCell
                                      className="text-xs uppercase tracking-wider"
                                      sx={{
                                        textAlign: "center",
                                        color: "white",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Sarin
                                    </TableCell>
                                    <TableCell
                                      className="text-xs uppercase tracking-wider"
                                      sx={{
                                        textAlign: "center",
                                        color: "white",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Inclu
                                    </TableCell>
                                    <TableCell
                                      className="text-xs uppercase tracking-wider"
                                      sx={{
                                        textAlign: "center",
                                        color: "white",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      AQ
                                    </TableCell>
                                    <TableCell
                                      className="text-xs uppercase tracking-wider"
                                      sx={{
                                        textAlign: "center",
                                        color: "white",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      4P
                                    </TableCell>
                                    <TableCell
                                      className="text-xs uppercase tracking-wider"
                                      sx={{
                                        textAlign: "center",
                                        color: "white",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Galaxy 4p
                                    </TableCell>
                                    <TableCell
                                      className="text-xs uppercase tracking-wider"
                                      sx={{
                                        textAlign: "center",
                                        color: "white",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      LS
                                    </TableCell>
                                    {!lastMonth && (
                                      <TableCell
                                        className="text-xs uppercase tracking-wider"
                                        sx={{
                                          textAlign: "center",
                                          color: "white",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Action
                                      </TableCell>
                                    )}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {row.subentry.map((subRow, subIndex) => (
                                    <TableRow key={subIndex}>
                                      <TableCell
                                        className="text-xs uppercase tracking-wider"
                                        sx={{ textAlign: "center" }}
                                      >
                                        {subRow.date}
                                      </TableCell>
                                      <TableCell
                                        className="text-xs uppercase tracking-wider"
                                        sx={{ textAlign: "center" }}
                                      >
                                        {subRow.sarin}
                                      </TableCell>
                                      <TableCell
                                        className="text-xs uppercase tracking-wider"
                                        sx={{ textAlign: "center" }}
                                      >
                                        {subRow.inclu}
                                      </TableCell>
                                      <TableCell
                                        className="text-xs uppercase tracking-wider"
                                        sx={{ textAlign: "center" }}
                                      >
                                        {subRow.aq}
                                      </TableCell>
                                      <TableCell
                                        className="text-xs uppercase tracking-wider"
                                        sx={{ textAlign: "center" }}
                                      >
                                        {subRow.fourp}
                                      </TableCell>
                                      <TableCell
                                        className="text-xs uppercase tracking-wider"
                                        sx={{ textAlign: "center" }}
                                      >
                                        {subRow.galexy}
                                      </TableCell>
                                      <TableCell
                                        className="text-xs uppercase tracking-wider"
                                        sx={{ textAlign: "center" }}
                                      >
                                        {subRow.ls}
                                      </TableCell>
                                      {!lastMonth && (
                                        <TableCell
                                          className="text-xs uppercase tracking-wider"
                                          sx={{ textAlign: "center" }}
                                        >
                                          <Tooltip
                                            title="Edit"
                                            placement="bottom"
                                          >
                                            <EditOutlinedIcon
                                              initial={{ scale: 0 }}
                                              animate={{
                                                scale: 1,
                                                transition: { delay: 0.2 },
                                              }}
                                              className="text-22 md:text-50"
                                              onClick={(event) =>
                                                handleEdit(subRow, row)
                                              }
                                              sx={{ cursor: "pointer" }}
                                            />
                                          </Tooltip>
                                        </TableCell>
                                      )}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
        <Dialog open={openModal}>
          <form onSubmit={handleSubmit(onAddSubmit)}>
            <DialogContent>
              <div className="bg-[#322f2f]">
                <h2 className="text-2xl text-white font-bold text-center mb-4 p-1">
                  Add New Entry
                </h2>
              </div>
              <div className="mb-3">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date"
                    inputFormat="dd-MM-yyyy"
                    mask="____-__-__"
                    value={dayjs(
                      moment(selectedDate, "DD-MM-YYYY").format("YYYY-MM-DD")
                    )}
                    onChange={handleChangeDate}
                    renderInput={(params) => (
                      <TextField className="datepickerCommon" {...params} />
                    )}
                    inputProps={{ readOnly: true }}
                    maxDate={dayjs(moment().toDate())}
                    minDate={dayjs(moment().subtract(2, "month").endOf('month').toDate())}
                  />
                </LocalizationProvider>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Controller
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Sarin"
                      fullWidth
                      type="number"
                      error={!!errors.sarin}
                      helperText={errors?.sarin?.message}
                      variant="outlined"
                    />
                  )}
                  name="sarin"
                  control={control}
                />
                <Controller
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Inclue"
                      fullWidth
                      type="number"
                      error={!!errors.inclu}
                      helperText={errors?.inclu?.message}
                      variant="outlined"
                    />
                  )}
                  name="inclu"
                  control={control}
                />
                <Controller
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="AQ"
                      fullWidth
                      type="number"
                      error={!!errors.aq}
                      helperText={errors?.aq?.message}
                      variant="outlined"
                    />
                  )}
                  name="aq"
                  control={control}
                />
                <Controller
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="4P"
                      fullWidth
                      type="number"
                      error={!!errors.fourP}
                      helperText={errors?.fourP?.message}
                      variant="outlined"
                    />
                  )}
                  name="fourP"
                  control={control}
                />
                <Controller
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Galaxy 4P"
                      fullWidth
                      type="number"
                      error={!!errors.galaxy4p}
                      helperText={errors?.galaxy4p?.message}
                      variant="outlined"
                    />
                  )}
                  name="galaxy4p"
                  control={control}
                />
                <Controller
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="ls"
                      fullWidth
                      type="number"
                      error={!!errors.ls}
                      helperText={errors?.ls?.message}
                      variant="outlined"
                    />
                  )}
                  name="ls"
                  control={control}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog open={openUpdate}>
          <form onSubmit={handleSubmit(updateEntry)}>
            <DialogContent>
              <div className="bg-[#322f2f]">
                <h2 className="text-2xl text-white font-bold text-center mb-4 p-1">
                  Update Entry
                </h2>
              </div>
              <div className="mb-3">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date"
                    inputFormat="dd-MM-yyyy"
                    mask="____-__-__"
                    value={dayjs(
                      moment(selectedDate, "DD-MM-YYYY").format("YYYY-MM-DD")
                    )}
                    onChange={handleChangeDate}
                    renderInput={(params) => (
                      <TextField className="datepickerCommon" {...params} />
                    )}
                    inputProps={{ readOnly: true }}
                    maxDate={dayjs(moment().toDate())}
                    minDate={dayjs(moment().subtract(2, "month").endOf('month').toDate())}
                  />
                </LocalizationProvider>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Controller
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Sarin"
                      fullWidth
                      type="number"
                      error={!!errors.sarin}
                      helperText={errors?.sarin?.message}
                      variant="outlined"
                    />
                  )}
                  name="sarin"
                  control={control}
                />
                <Controller
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Inclue"
                      fullWidth
                      type="number"
                      error={!!errors.inclu}
                      helperText={errors?.inclu?.message}
                      variant="outlined"
                    />
                  )}
                  name="inclu"
                  control={control}
                />
                <Controller
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="AQ"
                      fullWidth
                      type="number"
                      error={!!errors.aq}
                      helperText={errors?.aq?.message}
                      variant="outlined"
                    />
                  )}
                  name="aq"
                  control={control}
                />
                <Controller
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="4P"
                      fullWidth
                      type="number"
                      error={!!errors.fourP}
                      helperText={errors?.fourP?.message}
                      variant="outlined"
                    />
                  )}
                  name="fourP"
                  control={control}
                />
                <Controller
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Galaxy 4P"
                      fullWidth
                      type="number"
                      error={!!errors.galaxy4p}
                      helperText={errors?.galaxy4p?.message}
                      variant="outlined"
                    />
                  )}
                  name="galaxy4p"
                  control={control}
                />
                <Controller
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="ls"
                      fullWidth
                      type="number"
                      error={!!errors.ls}
                      helperText={errors?.ls?.message}
                      variant="outlined"
                    />
                  )}
                  name="ls"
                  control={control}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Update
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog open={openBill}>
          <form className="" onSubmit={billDownload}>
            <DialogContent>
              <div className="bg-[#322f2f]">
                <h2 className="text-2xl text-white font-bold text-center mb-4 p-1">
                  Billing
                </h2>
              </div>
              <div className="flex items-center mb-4">
                <TextField
                  label="Sarin Quantity"
                  fullWidth
                  type="number"
                  name="numbersarin"
                  value={pricetotal.numbersarin}
                  onChange={(e) => handleInputChangepricetotal(e)}
                  variant="outlined"
                  required
                  sx={{ flex: "1 1 0%", marginRight: "10px" }}
                />
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{ marginRight: "10px" }}
                >
                  x
                </Typography>
                <TextField
                  label="Sarin Unit Price"
                  fullWidth
                  type="number"
                  name="defaultpricesarin"
                  value={priceData.defaultpricesarin}
                  onChange={(e) => handleInputChangepricedefault(e)}
                  variant="outlined"
                  required
                  sx={{ flex: "1 1 0%", marginRight: "10px" }}
                />
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{ marginRight: "10px" }}
                >
                  =
                </Typography>
                <TextField
                  label="Sarin Total"
                  fullWidth
                  type="number"
                  name="mutlisarin"
                  value={priceMulti.mutlisarin}
                  onChange={(e) => handleInputChangepriceMulti(e)}
                  variant="outlined"
                  disabled={true}
                  required
                  sx={{ flex: "1 1 0%" }}
                />
              </div>

              <div className="flex items-center mb-4">
                <TextField
                  label="Inclue Quantity"
                  fullWidth
                  type="number"
                  name="numberinclue"
                  value={pricetotal.numberinclue}
                  onChange={(e) => handleInputChangepricetotal(e)}
                  variant="outlined"
                  required
                  sx={{ flex: "1 1 0%", marginRight: "10px" }}
                />
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{ marginRight: "10px" }}
                >
                  x
                </Typography>
                <TextField
                  label="Inclue Unit Price"
                  fullWidth
                  type="number"
                  name="defaultpriceinclue"
                  value={priceData.defaultpriceinclue}
                  onChange={(e) => handleInputChangepricedefault(e)}
                  variant="outlined"
                  required
                  sx={{ flex: "1 1 0%", marginRight: "10px" }}
                />
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{ marginRight: "10px" }}
                >
                  =
                </Typography>
                <TextField
                  label="Inclue Total"
                  fullWidth
                  type="number"
                  name="mutliinclue"
                  value={priceMulti.mutliinclue}
                  onChange={(e) => handleInputChangepriceMulti(e)}
                  variant="outlined"
                  required
                  disabled={true}
                  sx={{ flex: "1 1 0%" }}
                />
              </div>

              <div className="flex items-center mb-4">
                <TextField
                  label="AQ Quantity"
                  fullWidth
                  type="number"
                  name="numberaq"
                  value={pricetotal.numberaq}
                  onChange={(e) => handleInputChangepricetotal(e)}
                  variant="outlined"
                  required
                  sx={{ flex: "1 1 0%", marginRight: "10px" }}
                />
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{ marginRight: "10px" }}
                >
                  x
                </Typography>
                <TextField
                  label="AQ Unit Price"
                  fullWidth
                  type="number"
                  name="defaultpriceaq"
                  value={priceData.defaultpriceaq}
                  onChange={(e) => handleInputChangepricedefault(e)}
                  variant="outlined"
                  required
                  sx={{ flex: "1 1 0%", marginRight: "10px" }}
                />
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{ marginRight: "10px" }}
                >
                  =
                </Typography>
                <TextField
                  label="AQ Total"
                  fullWidth
                  type="number"
                  name="mutliaq"
                  value={priceMulti.mutliaq}
                  onChange={(e) => handleInputChangepriceMulti(e)}
                  variant="outlined"
                  required
                  disabled={true}
                  sx={{ flex: "1 1 0%" }}
                />
              </div>

              <div className="flex items-center mb-4">
                <TextField
                  label="4P Quantity"
                  fullWidth
                  type="number"
                  name="numberfourp"
                  value={pricetotal.numberfourp}
                  onChange={(e) => handleInputChangepricetotal(e)}
                  variant="outlined"
                  required
                  sx={{ flex: "1 1 0%", marginRight: "10px" }}
                />
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{ marginRight: "10px" }}
                >
                  x
                </Typography>
                <TextField
                  label="4P Unit Price"
                  fullWidth
                  type="number"
                  name="defaultpricefourp"
                  value={priceData.defaultpricefourp}
                  onChange={(e) => handleInputChangepricedefault(e)}
                  variant="outlined"
                  required
                  sx={{ flex: "1 1 0%", marginRight: "10px" }}
                />
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{ marginRight: "10px" }}
                >
                  =
                </Typography>
                <TextField
                  label="4P Total"
                  fullWidth
                  type="number"
                  name="mutlifourp"
                  value={priceMulti.mutlifourp}
                  onChange={(e) => handleInputChangepriceMulti(e)}
                  variant="outlined"
                  required
                  disabled={true}
                  sx={{ flex: "1 1 0%" }}
                />
              </div>

              <div className="flex items-center mb-4">
                <TextField
                  label="Galaxy 4P Quantity"
                  fullWidth
                  type="number"
                  name="numbergalexy"
                  value={pricetotal.numbergalexy}
                  onChange={(e) => handleInputChangepricetotal(e)}
                  variant="outlined"
                  required
                  sx={{ flex: "1 1 0%", marginRight: "10px" }}
                />
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{ marginRight: "10px" }}
                >
                  x
                </Typography>
                <TextField
                  label="Galaxy 4P Unit Price"
                  fullWidth
                  type="number"
                  name="defaultpricegalexy"
                  value={priceData.defaultpricegalexy}
                  onChange={(e) => handleInputChangepricedefault(e)}
                  variant="outlined"
                  required
                  sx={{ flex: "1 1 0%", marginRight: "10px" }}
                />
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{ marginRight: "10px" }}
                >
                  =
                </Typography>
                <TextField
                  label="Galaxy 4P Total"
                  fullWidth
                  type="number"
                  name="mutligalexy"
                  value={priceMulti.mutligalexy}
                  onChange={(e) => handleInputChangepriceMulti(e)}
                  variant="outlined"
                  required
                  disabled={true}
                  sx={{ flex: "1 1 0%" }}
                />
              </div>

              <div className="flex items-center mb-4">
                <TextField
                  label="LS Quantity"
                  fullWidth
                  type="number"
                  name="numberls"
                  value={pricetotal.numberls}
                  onChange={(e) => handleInputChangepricetotal(e)}
                  variant="outlined"
                  required
                  sx={{ flex: "1 1 0%", marginRight: "10px" }}
                />
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{ marginRight: "10px" }}
                >
                  x
                </Typography>
                <TextField
                  label="LS Unit Price"
                  fullWidth
                  type="number"
                  name="defaultpricels"
                  value={priceData.defaultpricels}
                  onChange={(e) => handleInputChangepricedefault(e)}
                  variant="outlined"
                  required
                  sx={{ flex: "1 1 0%", marginRight: "10px" }}
                />
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{ marginRight: "10px" }}
                >
                  =
                </Typography>
                <TextField
                  label="LS Total"
                  fullWidth
                  type="number"
                  name="mutlils"
                  value={priceMulti.mutlils}
                  onChange={(e) => handleInputChangepriceMulti(e)}
                  variant="outlined"
                  required
                  disabled={true}
                  sx={{ flex: "1 1 0%" }}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={handleCloseBilling}
              >
                Cancel
              </Button>
              {/* <Button variant="contained" color="primary" type="submit">
                Download
              </Button> */}
              <PDFDownloadLink
                document={<InvoicePDF invoiceData={invoiceData} />}
                fileName={`${moment().format("DD-MM-YYYY")}_${data?.name}.pdf`}
              >
                {({ blob, url, loading, error }) =>
                  loading ? (
                    <LoadingButton
                      loading={true}
                      loadingIndicator="Loading…"
                      variant="outlined"
                    >
                      <span>Fetch data</span>
                    </LoadingButton>
                  ) : (
                    <Button variant="contained" color="primary">
                      Download
                    </Button>
                  )
                }
              </PDFDownloadLink>
            </DialogActions>
          </form>
        </Dialog>
        {/* {invoiceData && (
          <PDFDownloadLink
            document={<InvoicePDF invoiceData={invoiceData} />}
            fileName="invoice.pdf"
          >
            {({ loading }) =>
              loading ? "Generating document..." : "Download PDF"
            }
          </PDFDownloadLink>
        )} */}
      </div>
    </div>
  );
}

export default Details;
