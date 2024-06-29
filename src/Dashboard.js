import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { addContacts, contacts, deleteContacts, updateContacts } from "./config/config";

const defaultValues = {
  name: "",
  mobile: "",
};

const schema = yup.object().shape({
  name: yup.string().required("Name is Required"),
  mobile: yup.string().required("Mobile Number is Required"),
});

function Dashboard() {
  const { handleSubmit, control, formState, reset, setValue } = useForm({
    defaultValues,
    mode: "all",
    resolver: yupResolver(schema),
  });
  const { errors } = formState;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [OpenUpdate, setOpenUpdate] = useState(false);
  const [updateId, setUpdateId] = useState("");
  // const [formData, setFormData] = useState({
  //   name: "",
  //   mobileNumber: "",
  // });

  const getUserList = () => {
    Swal.fire({
      title: "Loading",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    axios({
      method: "GET",
      url: contacts,
    })
      .then((response) => {
        Swal.close();
        if (response.status === 200) {
          setData(response.data);
        }
      })
      .catch((_errors) => {
        Swal.close();
        setData([]);
      });
  };
  useEffect(() => {
    getUserList();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setOpenUpdate(false);
    reset();
  };

  const onSubmit = (data) => {
    setOpenModal(false);
    Swal.fire({
      title: "Are you sure?",
      text: "Add the Client's Details",
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
          method: "POST",
          url: addContacts,
          data: data,
        })
          .then((response) => {
            if (response.status === 200) {
              Swal.close();
              setOpenModal(false);
              reset();
              Swal.fire({
                icon: "success",
                text: response.data.message,
                timer: 2000, // 2 seconds timer
                showConfirmButton: false, // Hide the confirmation button
                allowOutsideClick: false,
                willClose: () => {
                  getUserList();
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
        setOpenModal(true);
      }
    });
  };

  const handleLogout = () => {
    navigate("/login");
    localStorage.clear();
  };

  const handleUpdate = (data) => {
    setUpdateId(data._id);
    setValue("name", data.name);
    setValue("mobile", data.mobile);
    setOpenUpdate(true);
  };

  const handleNavigate = (data) => {
    navigate("/details", { state: data });
  };

  const onUpdateSubmit = (data) => {
    setOpenUpdate(false);
    Swal.fire({
      title: "Are you sure?",
      text: "Update the Client's Details",
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
          url: updateContacts + updateId,
          data: data,
        })
          .then((response) => {
            if (response.status === 200) {
              Swal.close();
              Swal.fire({
                icon: "success",
                text: response.data.message,
                timer: 2000,
                showConfirmButton: false, // Hide the confirmation button
                allowOutsideClick: false,
                willClose: () => {
                  getUserList();
                  reset();
                  setOpenModal(false);
                  setOpenUpdate(false);
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

  const handleDelete = (data) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete the Client's Details",
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
          method: "DELETE",
          url: deleteContacts + data._id ,
        })
          .then((response) => {
            if (response.status === 200) {
              Swal.close();
              Swal.fire({
                icon: "success",
                text: response.data.message,
                timer: 2000,
                showConfirmButton: false,
                allowOutsideClick: false,
                willClose: () => {
                  getUserList();
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
      }
    });
  };

  const filteredData = data.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mobile.toString().includes(searchQuery)
    );
  });

  return (
    <div className="h-full">
      <div className="bg-[#322f2f] h-20 flex justify-between fixed top-0 left-0 w-full z-10">
        <div>
          <img
            className="h-20 cursor-pointer"
            src="Sraddha.png"
            alt="Sraddha"
          />
        </div>
        <div className="flex">
          <div className="mt-5 mr-9">
            <input
              className="rounded-lg px-3 py-2 w-[500px] cursor-pointer"
              type="search"
              placeholder="Search here..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="mt-5 mr-4">
            <Button
              className="h-10"
              variant="contained"
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-[#ECECEC] px-11 py-3 mt-20 overflow-auto h-[calc(100%-5rem)]">
        <div className="flex justify-between mb-3">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            color="success"
            onClick={handleOpenModal}
          >
            Add Client
          </Button>
        </div>

        {data.length !== 0 && (
          <div className="">
            <TableContainer component={Paper}>
              <Table className="min-w-full divide-y divide-gray-200">
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
                      Sr No
                    </TableCell>
                    <TableCell
                      className="text-xs uppercase tracking-wider"
                      sx={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      className="text-xs uppercase tracking-wider"
                      sx={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Mobile Number
                    </TableCell>
                    <TableCell
                      className="text-xs uppercase tracking-wider"
                      sx={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Information
                    </TableCell>
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
                  </TableRow>
                </TableHead>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((row, index) => (
                    <TableRow
                      key={row.srNo}
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
                        {index + 1}
                      </TableCell>
                      <TableCell
                        className="text-xs uppercase tracking-wider"
                        sx={{ textAlign: "center" }}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell
                        className="text-xs uppercase tracking-wider"
                        sx={{ textAlign: "center" }}
                      >
                        {row.mobile}
                      </TableCell>
                      <TableCell
                        className="text-xs uppercase tracking-wider"
                        sx={{ textAlign: "center" }}
                      >
                        <Button
                          variant="outlined"
                          color="inherit"
                          startIcon={<DriveFileMoveIcon />}
                          onClick={() => {
                            handleNavigate(row);
                          }}
                        >
                          Data
                        </Button>
                      </TableCell>
                      <TableCell
                        className="text-xs uppercase tracking-wider"
                        sx={{ textAlign: "center" }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ marginRight: "10px" }}
                          onClick={() => {
                            handleUpdate(row);
                          }}
                        >
                          Update
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => {
                            handleDelete(row);
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>

      <Dialog open={openModal}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <div className="bg-[#322f2f]">
              <h2 className="text-2xl text-white font-bold text-center mb-4 p-1">
                Add New Client
              </h2>
            </div>
            <Controller
              render={({ field }) => (
                <TextField
                  className="feild"
                  {...field}
                  id="outlined-basic"
                  label="Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                  variant="outlined"
                />
              )}
              name="name"
              control={control}
            />
            <Controller
              render={({ field }) => (
                <TextField
                  className="feild"
                  {...field}
                  id="outlined-basic"
                  label="Mobile Number"
                  fullWidth
                  type="number"
                  error={!!errors.mobile}
                  helperText={errors?.mobile?.message}
                  variant="outlined"
                />
              )}
              name="mobile"
              control={control}
            />
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

      <Dialog open={OpenUpdate}>
        <form onSubmit={handleSubmit(onUpdateSubmit)}>
          <DialogContent>
            <div className="bg-[#322f2f]">
              <h2 className="text-2xl text-white font-bold text-center mb-4 p-1">
                Update Client's Details
              </h2>
            </div>
            <Controller
              render={({ field }) => (
                <TextField
                  className="feild"
                  {...field}
                  id="outlined-basic"
                  label="Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                  variant="outlined"
                />
              )}
              name="name"
              control={control}
            />
            <Controller
              render={({ field }) => (
                <TextField
                  className="feild"
                  {...field}
                  id="outlined-basic"
                  label="Mobile Number"
                  fullWidth
                  type="number"
                  error={!!errors.mobile}
                  helperText={errors?.mobile?.message}
                  variant="outlined"
                />
              )}
              name="mobile"
              control={control}
            />
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
    </div>
  );
}

export default Dashboard;
