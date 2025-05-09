import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  ThemeProvider,
  createTheme,
  CssBaseline,
  InputAdornment,
  IconButton,
  StyledEngineProvider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import {
  Person,
  Badge,
  Groups,
  School,
  SupervisorAccount,
  CalendarToday,
  GetApp,
  Lock,
  PictureAsPdf,
} from "@mui/icons-material";
// Import pdfMake for PDF generation
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Create a dark theme with Material UI
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#64b5f6", // A slightly darker blue
    },
    secondary: {
      main: "#f57f17", // A darker yellow/amber
    },
    background: {
      default: "#000000", // Pure black
      paper: "#121212", // Very dark grey
    },
    text: {
      primary: "#ffffff", // Pure white
      secondary: "#9e9e9e", // Medium grey
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 400,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          padding: "10px 20px",
          borderRadius: 4,
        },
        containedPrimary: {
          background: "linear-gradient(45deg, #1565c0 30%, #42a5f5 90%)",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)", // Increased shadow
          "&:hover": {
            background: "linear-gradient(45deg, #0d47a1 30%, #3949ab 90%)", // Even darker on hover
          },
        },
        containedSecondary: {
          background: "linear-gradient(45deg, #ef6c00 30%, #f9a825 90%)",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)", // Increased shadow
          "&:hover": {
            background: "linear-gradient(45deg, #e65100 30%, #f57f17 90%)", // Even darker on hover
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "16px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#424242", // Darker border
            },
            "&:hover fieldset": {
              borderColor: "#616161", // Slightly lighter on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#64b5f6", // Primary color when focused
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "#121212", // Solid dark grey
          border: "1px solid #212121", // Even darker border
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)", // Increased shadow
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          "& .MuiAlert-root": {
            borderRadius: 4,
            backgroundColor: "#212121", // Darker snackbar background
            color: "#ffffff",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#424242", // Darker border
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#616161", // Slightly lighter on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#64b5f6", // Primary color when focused
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginBottom: "16px",
          width: "100%",
        },
      },
    },
  },
});

// Register virtual file system for pdfMake
pdfMake.vfs = pdfFonts;

// Function to generate PDF document definition
const generatePdfDefinition = (formData) => {
  const {
    student_name,
    usn,
    club_name,
    department_name,
    hod_name,
    proctor_name,
    date,
    semester,
    section,
  } = formData;

  // Format the date
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Function to get ordinal suffix
  const getOrdinalSuffix = (n) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  };

  const semesterWithSuffix = semester + getOrdinalSuffix(parseInt(semester));

  return {
    content: [
      {
        text: `Date: ${formattedDate}`,
        alignment: "right",
        margin: [0, 0, 0, 15],
      },
      {
        text: [
          "From,\n",
          `${student_name}\n`,
          `${usn}\n`,
          `${department_name} Dept.\n`,
          "BMS Institute of Technology & Management",
        ],
        margin: [0, 0, 0, 15],
      },
      {
        text: [
          "To,\n",
          "The Head of Department,\n",
          `${department_name} Dept.,\n`,
          "BMS Institute of Technology & Management",
        ],
        margin: [0, 0, 0, 15],
      },
      {
        text: `Through:\n${proctor_name}\nProctor, ${department_name} Dept.`,
        margin: [0, 0, 0, 15],
      },
      {
        text: `Subject: Request for Permission to Participate in ${club_name} Club Activities`,
        style: "subheader",
        margin: [0, 0, 0, 15],
      },
      {
        text: "Respected Sir/Madam,",
        margin: [0, 0, 0, 10],
      },
      {
        text: `I, ${student_name}, a student of ${semesterWithSuffix} Semester, Section ${section} in the ${department_name} department, respectfully seek your kind approval to continue my participation and coordination in the activities organized by the ${club_name}.`,
        margin: [0, 0, 0, 10],
      },
      {
        text: "As per the latest circular regarding participation in departmental, institutional, and club activities, I confirm that I fulfill the following criteria:",
        margin: [0, 0, 0, 10],
      },
      {
        ul: [
          "My CGPA is above 6.0.",
          "I do not have any academic backlogs.",
          "My attendance is above 75%.",
        ],
        margin: [0, 0, 0, 8],
      },
      {
        text: "I assure you that my involvement in the club will not hamper my academic performance, and I will continue to prioritize my coursework and responsibilities.",
        margin: [0, 0, 0, 10],
      },
      {
        text: `Kindly grant me permission to actively contribute to the ${club_name} club initiatives. I request both my Proctor and the Head of Department to kindly sign this letter as a mark of approval.`,
        margin: [0, 0, 0, 15],
      },
      {
        text: "Thanking you in anticipation.",
        margin: [0, 0, 0, 30],
      },
      {
        text: ["Yours sincerely,\n", `${student_name}\n`],
        margin: [0, 0, 0, 100],
      },

      {
        columns: [
          {
            stack: [
              {
                canvas: [
                  {
                    type: "line",
                    x1: 40, // Center the line in the column
                    y1: 0,
                    x2: 190,
                    y2: 0,
                    lineWidth: 1,
                  },
                ],
                margin: [0, 0, 0, 5],
              },
              {
                text: hod_name,
                fontSize: 10,
                alignment: "center", // Center the name
              },
              {
                text: `Head of Department\n${department_name} Dept.`,
                fontSize: 8,
                italics: true,
                alignment: "center", // Center the position
              },
            ],
            width: "50%",
          },
          {
            stack: [
              {
                canvas: [
                  {
                    type: "line",
                    x1: 40, // Center the line in the column
                    y1: 0,
                    x2: 190,
                    y2: 0,
                    lineWidth: 1,
                  },
                ],
                margin: [0, 0, 0, 5],
              },
              {
                text: proctor_name,
                fontSize: 10,
                alignment: "center", // Center the name
              },
              {
                text: `Proctor\n${department_name} Dept.`,
                fontSize: 8,
                italics: true,
                alignment: "center", // Center the position
              },
            ],
            width: "50%",
          },
        ],
      },
    ],
    styles: {
      header: {
        fontSize: 16,
        bold: true,
      },
      subheader: {
        fontSize: 12,
        bold: true,
      },
      approval: {
        bold: true,
        fontSize: 10,
      },
      name: {
        fontSize: 10,
      },
      position: {
        fontSize: 9,
        italics: true,
      },
    },
    defaultStyle: {
      fontSize: 10,
      lineHeight: 1.1,
    },
    pageSize: "A4",
    pageMargins: [60, 60, 60, 60], // Smaller margins (15mm)
  };
};

export default function App() {
  const [texliveInitialized, setTexliveInitialized] = useState(false);
  const [form, setForm] = useState({
    student_name: "",
    usn: "",
    club_name: "",
    department_name: "",
    hod_name: "",
    proctor_name: "",
    date: "",
    semester: "",
    section: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Define options for dropdown menus
  const semesterOptions = [1, 2, 3, 4, 5, 6, 7, 8];
  const sectionOptions = ["A", "B", "C", "D", "E", "F", "G", "H"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Generate PDF document definition
      const pdfDocDefinition = generatePdfDefinition(form);

      // Create PDF and download
      pdfMake
        .createPdf(pdfDocDefinition)
        .download(
          `permission_letter_${form.student_name
            .replace(/\s+/g, "_")
            .toLowerCase()}.pdf`
        );

      // Show success message
      setAlert({
        open: true,
        message: "Permission letter successfully generated!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error generating PDF:", err);
      setAlert({
        open: true,
        message: `Failed to generate PDF: ${err.message}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  // Form field configurations (excluding semester and section which will be dropdowns)
  const textFields = [
    { name: "student_name", label: "Student Name", icon: <Person /> },
    { name: "usn", label: "USN", icon: <Badge /> },
    { name: "club_name", label: "Club Name", icon: <Groups /> },
    { name: "department_name", label: "Department Name", icon: <School /> },
    { name: "hod_name", label: "HoD Name", icon: <SupervisorAccount /> },
    {
      name: "proctor_name",
      label: "Proctor Name",
      icon: <SupervisorAccount />,
    },
  ];

  // Check if form is valid
  const isFormValid = () => {
    return Object.values(form).every((value) => {
      // For strings, check if they're not empty after trimming
      if (typeof value === "string") {
        return value.trim() !== "";
      }
      // For numbers, check if they're not null/undefined
      return value !== null && value !== undefined && value !== "";
    });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: "100vh",
            py: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 2,
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Box textAlign="center" mb={4}>
              <Typography variant="h4" component="h1" gutterBottom>
                Permission Letter Generator
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fill in the details to generate your permission letter
              </Typography>
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <PictureAsPdf color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="primary">
                  Client-side PDF generation ready
                </Typography>
              </Box>
            </Box>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {textFields.map((field) => (
                  <Grid size={{ xs: 12 }} key={field.name}>
                    <TextField
                      fullWidth
                      name={field.name}
                      label={field.label}
                      value={form[field.name]}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {field.icon}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                ))}

                {/* Semester Dropdown */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth required variant="outlined">
                    <InputLabel id="semester-label">Semester</InputLabel>
                    <Select
                      labelId="semester-label"
                      id="semester"
                      name="semester"
                      value={form.semester}
                      onChange={handleChange}
                      label="Semester"
                      startAdornment={
                        <InputAdornment position="start">
                          <School />
                        </InputAdornment>
                      }
                    >
                      {semesterOptions.map((sem) => (
                        <MenuItem key={sem} value={sem}>
                          {sem}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Section Dropdown */}
                <Grid size={{ xs: 12, md: 6 }} key="section">
                  <TextField
                    fullWidth
                    name="section"
                    label="Section"
                    value={form.section}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <School />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    name="date"
                    label="Date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ width: "100%" }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading || !isFormValid()}
                    startIcon={
                      loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <GetApp />
                      )
                    }
                    sx={{
                      height: 56,
                      background:
                        "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                      boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                    }}
                  >
                    {loading ? "Generating..." : "Generate PDF"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Lock fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
              Client-side processing • Data never leaves your browser
            </Typography>
          </Box>
        </Box>

        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={alert.severity}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}
