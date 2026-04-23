import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControlLabel,
  Checkbox,
  Alert,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as emailjs from "emailjs-com";

const ContactComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Ajustá si tu navbar mide distinto (esto es CLAVE para matar scroll)
  const navOffset = isMobile ? 68 : 88;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    services: [],
    message: "",
    agree: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    services: "",
    agree: "",
  });

  const [success, setSuccess] = useState(false);

  const servicesList = [
    "Estribos a Medida",
    "Barras Lisas",
    "Barras Conformadas",
    "Mallas Electrosoldadas",
    "Mallas Plegadas",
    "Otros",
  ];

  useEffect(() => {
    emailjs.init("mG1zb3WhQquVBDEy5");
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleServiceSelect = (service) => {
    const updatedServices = formData.services.includes(service)
      ? formData.services.filter((s) => s !== service)
      : [...formData.services, service];

    setFormData((prev) => ({ ...prev, services: updatedServices }));
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() === "" ? "Requerido" : "",
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ? "Email inválido"
        : "",
      services: formData.services.length === 0 ? "Seleccione uno" : "",
      agree: !formData.agree ? "Debe aceptar" : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((x) => x !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const templateParams = {
      from_name: formData.name,
      email: formData.email,
      company: formData.company || "No especificada",
      to_name: "Ventas Aceros Paisano",
      services: formData.services.join(", "),
      message: formData.message || "Sin mensaje",
      agree: formData.agree ? "Sí" : "No",
    };

    emailjs
      .send(
        "service_u25ou8s",
        "template_t3qai7e",
        templateParams,
        "mG1zb3WhQquVBDEy5"
      )
      .then(() => {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          company: "",
          services: [],
          message: "",
          agree: false,
        });
        setErrors({ name: "", email: "", services: "", agree: "" });
      })
      .catch(() => alert("Error al enviar."));
  };

  const labelStyle = {
    fontFamily: "'Geist Mono', monospace",
    color: "#8a8a8a",
    fontSize: { xs: "0.62rem", md: "0.72rem" }, // aumentado
    textTransform: "uppercase",
    letterSpacing: "0.13em",
    mb: 0.45, // más aire
    display: "block",
    lineHeight: 1.4, // más espaciado entre líneas
  };

  const textFieldStyle = {
    mb: { xs: 1.15, md: 1.3 }, // más separación
    "& .MuiInput-underline:before": { borderColor: "#232323" },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderColor: "#343434",
    },
    "& .MuiInput-underline:after": { borderColor: "#EE2737" },
    "& input, & textarea": {
      color: "#fff",
      fontSize: { xs: "0.92rem", md: "1.04rem" }, // aumentado
      py: 0.4,
      lineHeight: 1.5, // más espaciado
    },
    "& input::placeholder, & textarea::placeholder": {
      color: "#5f5f5f",
      opacity: 1,
    },
  };

  return (
    <Box
      sx={{
        height: `calc(100dvh - ${navOffset}px)`,
        width: "100%",
        boxSizing: "border-box",
        bgcolor: "#000",
        color: "#fff",
        overflow: "hidden",
        px: { xs: "16px", sm: "22px", md: "43px" }, // web exacto 43px
        py: { xs: "10px", sm: "12px", md: "10px" }, // bajo para evitar scroll
        display: "flex",
        alignItems: "stretch",
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          @import url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/mono.css');
          footer, .footer, #footer { display: none !important; }
          html, body, #root { height: 100%; overflow: hidden !important; }
          body { margin: 0; padding: 0; background: #000; }
        `}
      </style>

      <Grid
        container
        sx={{
          width: "100%",
          height: "100%",
          margin: 0,
          minHeight: 0,
          overflow: "hidden",
        }}
        columnSpacing={{ xs: 0, md: 3.5 }}
        rowSpacing={{ xs: 1.2, md: 0 }}
      >
        {/* IZQUIERDA */}
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", md: "center" },
            minHeight: 0,
            pr: { xs: 0, md: 1.5 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: { xs: "auto", md: "min(560px, 100%)" },
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: { xs: "flex-start", md: "space-between" },
              transform: { xs: "none", md: "translateY(18px)" }, // baja visual sin sumar altura
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontSize: {
                  xs: "1.96rem",
                  sm: "2.1rem",
                  md: "4.35rem",
                  lg: "5rem",
                },
                fontWeight: 400,
                lineHeight: { xs: 1.0, md: 0.94 },
                letterSpacing: "-0.045em",
                mt: 0,
                mb: { xs: 1.35, md: 0 },
                maxWidth: { xs: "100%", md: "95%" },
              }}
            >
              Construyendo el futuro del acero en Uruguay.
            </Typography>

            {/* más separado de la frase */}
            <Box
              sx={{
                pt: { xs: 0.25, md: 1.1 },
                mt: { xs: 0.2, md: 0 },
                maxWidth: { xs: "100%", md: "96%" },
              }}
            >
              <Grid
                container
                columnSpacing={{ xs: 2, sm: 3, md: 5 }}
                rowSpacing={{ xs: 1.1, md: 0.9 }}
              >
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" sx={labelStyle}>EMPRESA</Typography>
                  <Typography
                    variant="body2"
                    component="a"
                    href="mailto:ventas@acerospaisano.com.uy"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      mb: 1.2,
                      fontSize: { xs: "0.88rem", md: "0.98rem" },
                      lineHeight: 1.5,
                      color: "#fff",
                      textDecoration: "none",
                      transition: "color 0.2s",
                      "&:hover": {
                        color: "#EE2737",
                      },
                    }}
                  >
                    ventas@acerospaisano.com.uy
                  </Typography>

                  <Typography variant="h6" sx={labelStyle}>TELÉFONOS</Typography>
                  <Typography
                    variant="body2"
                    component="a"
                    href="https://wa.me/59899914939"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: { xs: "0.88rem", md: "0.98rem" },
                      lineHeight: 1.5,
                      color: "#fff",
                      textDecoration: "none",
                      transition: "color 0.2s",
                      "&:hover": {
                        color: "#EE2737",
                      },
                    }}
                  >
                    +598 99 914 939 / 2365 0000
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" sx={labelStyle}>DIRECCIÓN</Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: { xs: "0.88rem", md: "0.98rem" },
                      lineHeight: 1.5,
                    }}
                  >
                    Brigadier Gral. Fructuoso Rivera KM 25.500 (Ruta 5)
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: { xs: "0.88rem", md: "0.98rem" },
                      lineHeight: 1.5,
                    }}
                  >
                    15900 18 de Mayo, Departamento de Canelones
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>

        {/* DERECHA */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", md: "center" },
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: { xs: "auto", md: "min(560px, 100%)" },
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              transform: { xs: "none", md: "translateY(18px)" }, // baja visual
            }}
          >
            <Box
              component="img"
              src="/images/doblado6.jpg"
              alt="Aceros"
              sx={{
                width: "100%",
                height: { xs: "78px", sm: "92px", md: "136px", lg: "156px" },
                objectFit: "cover",
                borderRadius: "2px",
                filter: "brightness(0.84)",
                mb: { xs: 1.25, md: 1.5 }, // + aire
                flexShrink: 0,
              }}
            />

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {success && (
                <Alert
                  severity="success"
                  sx={{
                    mb: 1,
                    bgcolor: "transparent",
                    color: "#EE2737",
                    border: "1px solid #EE2737",
                    borderRadius: 0,
                    py: 0.2,
                    "& .MuiAlert-message": {
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: "0.74rem",
                      letterSpacing: "0.05em",
                    },
                  }}
                >
                  ¡ENVIADO!
                </Alert>
              )}

              <Grid
                container
                columnSpacing={{ xs: 1.2, md: 1.6 }}
                rowSpacing={{ xs: 0.55, md: 0.75 }} // DESAPRETADO
                sx={{ minHeight: 0 }}
              >
                <Grid item xs={6}>
                  <Typography sx={labelStyle}>NOMBRE</Typography>
                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Nombre"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    sx={textFieldStyle}
                  />
                  {!!errors.name && (
                    <Typography
                      sx={{
                        color: "#EE2737",
                        fontSize: "0.68rem",
                        mt: -0.35,
                        mb: 0.2,
                        fontFamily: "'Geist Mono', monospace",
                      }}
                    >
                      {errors.name}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={6}>
                  <Typography sx={labelStyle}>EMAIL</Typography>
                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    sx={textFieldStyle}
                  />
                  {!!errors.email && (
                    <Typography
                      sx={{
                        color: "#EE2737",
                        fontSize: "0.68rem",
                        mt: -0.35,
                        mb: 0.2,
                        fontFamily: "'Geist Mono', monospace",
                      }}
                    >
                      {errors.email}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={labelStyle}>EMPRESA</Typography>
                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Opcional"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    sx={textFieldStyle}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={labelStyle}>PRODUCTOS Y SERVICIOS</Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      columnGap: { xs: 0.65, md: 0.75 },
                      rowGap: { xs: 0.6, md: 0.7 },
                      mt: 0.45,
                      mb: 0.4,
                    }}
                  >
                    {servicesList.map((s) => {
                      const selected = formData.services.includes(s);
                      return (
                        <Button
                          key={s}
                          type="button"
                          onClick={() => handleServiceSelect(s)}
                          sx={{
                            fontFamily: "'Geist Mono', monospace",
                            fontSize: { xs: "0.56rem", md: "0.66rem" }, // + tamaño
                            lineHeight: 1.08,
                            color: selected ? "#fff" : "#7d7d7d",
                            bgcolor: selected ? "#EE2737" : "transparent",
                            border: selected
                              ? "1px solid #EE2737"
                              : "1px solid #2a2a2a",
                            borderRadius: "2px",
                            px: { xs: 0.95, md: 1.35 },
                            py: { xs: 0.22, md: 0.28 }, // + alto
                            minWidth: "unset",
                            minHeight: "unset",
                            textTransform: "none",
                            whiteSpace: "nowrap",
                            "&:hover": {
                              bgcolor: selected ? "#EE2737" : "#111",
                              color: "#fff",
                            },
                          }}
                        >
                          {s}
                        </Button>
                      );
                    })}
                  </Box>

                  {!!errors.services && (
                    <Typography
                      sx={{
                        color: "#EE2737",
                        fontSize: "0.68rem",
                        mt: 0.15,
                        fontFamily: "'Geist Mono', monospace",
                      }}
                    >
                      {errors.services}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={labelStyle}>MENSAJE</Typography>
                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Descripción del proyecto..."
                    name="message"
                    multiline
                    rows={1}
                    value={formData.message}
                    onChange={handleChange}
                    sx={{
                      ...textFieldStyle,
                      mb: { xs: 0.8, md: 0.95 },
                      "& textarea": {
                        minHeight: "24px !important",
                        resize: "none",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      mt: { xs: 0.65, md: 0.9 }, // + separación arriba del row final
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: { xs: "stretch", md: "center" },
                      flexDirection: { xs: "column", md: "row" },
                      gap: { xs: 1, md: 1.4 },
                    }}
                  >
                    <Box sx={{ alignSelf: "flex-start" }}>
                      <FormControlLabel
                        sx={{ ml: -0.45, mr: 0 }}
                        control={
                          <Checkbox
                            size="small"
                            sx={{
                              color: "#333",
                              p: 0.5,
                              "&.Mui-checked": { color: "#EE2737" },
                            }}
                            checked={formData.agree}
                            onChange={handleChange}
                            name="agree"
                          />
                        }
                        label={
                          <Typography
                            sx={{
                              color: errors.agree ? "#EE2737" : "#555",
                              fontFamily: "'Geist Mono', monospace",
                              fontSize: { xs: "0.52rem", md: "0.58rem" }, // + tamaño
                              lineHeight: 1.15,
                              letterSpacing: "0.03em",
                            }}
                          >
                            ACEPTO EL PROCESAMIENTO DE DATOS
                          </Typography>
                        }
                      />
                      {!!errors.agree && (
                        <Typography
                          sx={{
                            color: "#EE2737",
                            fontSize: "0.68rem",
                            mt: -0.2,
                            ml: 0.2,
                            fontFamily: "'Geist Mono', monospace",
                          }}
                        >
                          {errors.agree}
                        </Typography>
                      )}
                    </Box>

                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        bgcolor: "#fff",
                        color: "#000",
                        px: { xs: 3.2, md: 5.2 },
                        py: { xs: 0.9, md: 1.02 },
                        borderRadius: 0,
                        fontFamily: "'Geist Mono', monospace",
                        fontWeight: 700,
                        fontSize: { xs: "0.66rem", md: "0.75rem" }, // + tamaño
                        letterSpacing: "0.05em",
                        width: { xs: "100%", md: "auto" },
                        minWidth: { md: "190px" },
                        "&:hover": { bgcolor: "#EE2737", color: "#fff" },
                      }}
                    >
                      ENVIAR CONSULTA
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactComponent;
