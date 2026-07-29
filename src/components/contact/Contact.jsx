import React, { useEffect, useRef, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControlLabel,
  Checkbox,
  Alert,
  Select,
  MenuItem,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import * as emailjs from "emailjs-com";

const servicesList = [
  "Estribos a Medida",
  "Barras Lisas",
  "Barras Conformadas",
  "Mallas Electrosoldadas",
  "Mallas Plegadas",
  "Hierro Cortado y Doblado",
  "Armaduras de Pilotes",
  "Pasadores",
  "Trelizas",
  "Columnas y Vigas",
  "Otros",
];

const labelStyle = {
  fontFamily: "'Geist Mono', monospace",
  color: "#8a8a8a",
  fontSize: { xs: "0.62rem", md: "0.7rem" },
  textTransform: "uppercase",
  letterSpacing: "0.13em",
  mb: 0.6,
  display: "block",
  lineHeight: 1.4,
};

const textFieldStyle = {
  "& .MuiInput-underline:before": { borderColor: "#d9d9d9" },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderColor: "#b5b5b5",
  },
  "& .MuiInput-underline:after": { borderColor: "#EE2737" },
  "& input, & textarea": {
    color: "#111",
    fontSize: { xs: "0.92rem", md: "1rem" },
    py: 0.6,
    lineHeight: 1.5,
  },
  "& input::placeholder, & textarea::placeholder": {
    color: "#9a9a9a",
    opacity: 1,
  },
};

const CARD_PAD_X = { xs: "22px", md: "40px" };

const infoItems = [
  {
    icon: <MailOutlineIcon sx={{ fontSize: 20 }} />,
    label: "EMAIL",
    lines: [
      {
        text: "ventas@acerospaisano.com.uy",
        href: "mailto:ventas@acerospaisano.com.uy",
      },
    ],
  },
  {
    icon: <LocalPhoneOutlinedIcon sx={{ fontSize: 20 }} />,
    label: "TELÉFONOS",
    lines: [
      {
        text: "+598 99 914 939 / 2365 0000",
        href: "https://wa.me/59899914939",
      },
    ],
  },
  {
    icon: <PlaceOutlinedIcon sx={{ fontSize: 20 }} />,
    label: "DIRECCIÓN",
    lines: [{ text: "Ruta 5 Km 25.500, Las Piedras, Canelones, Uruguay" }],
  },
  {
    icon: <AccessTimeOutlinedIcon sx={{ fontSize: 20 }} />,
    label: "HORARIO",
    lines: [{ text: "Oficina: Lun–Vie 8:00–17:00 hs" }],
  },
];

const ContactComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navOffset = isMobile ? 68 : 88;

  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const [attachedFile, setAttachedFile] = useState(null);

  // Los campos de texto son no controlados: escribir no re-renderiza el
  // componente (evita trabajo de MUI por tecla y mejora el INP). Solo el
  // Select, el checkbox y los errores viven en estado de React.
  const [services, setServices] = useState([]);
  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    services: "",
    agree: "",
  });

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    emailjs.init("mG1zb3WhQquVBDEy5");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(formRef.current);
    const name = (data.get("name") || "").toString();
    const email = (data.get("email") || "").toString();
    const company = (data.get("company") || "").toString();
    const message = (data.get("message") || "").toString();

    const newErrors = {
      name: name.trim() === "" ? "Requerido" : "",
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Email inválido" : "",
      services: services.length === 0 ? "Seleccione uno" : "",
      agree: !agree ? "Debe aceptar" : "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((x) => x !== "")) return;

    const messageWithFile = attachedFile
      ? `${message || "Sin mensaje"}\n\n[Adjuntó archivo: ${attachedFile.name}]`
      : message || "Sin mensaje";

    const templateParams = {
      from_name: name,
      email,
      company: company || "No especificada",
      to_name: "Ventas Aceros Paisano",
      services: services.join(", "),
      message: messageWithFile,
      agree: agree ? "Sí" : "No",
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
        formRef.current?.reset();
        setServices([]);
        setAgree(false);
        setErrors({ name: "", email: "", services: "", agree: "" });
        setAttachedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      })
      .catch(() => alert("Error al enviar."));
  };

  return (
    <Box
      sx={{
        height: { xs: "auto", md: "100dvh" },
        minHeight: { xs: `calc(100dvh - ${navOffset}px)`, md: "unset" },
        width: "100%",
        boxSizing: "border-box",
        position: "relative",
        color: "#fff",
        overflow: "hidden",
        px: { xs: "16px", sm: "22px", md: "3.5vw" },
        pt: { xs: "28px", sm: "34px", md: "104px" },
        pb: { xs: "28px", sm: "34px", md: "36px" },
        display: "flex",
        alignItems: "center",
        backgroundColor: "#0a0e14",
        backgroundImage:
          "linear-gradient(rgba(10, 14, 20, 0.6), rgba(10, 14, 20, 0.6)), url('/images/contactnew.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          @import url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/mono.css');
          footer, .footer, #footer { display: none !important; }
          body { margin: 0; padding: 0; background: #0a0e14; }
          @media (min-width: 900px) {
            html, body, #root { overflow: hidden !important; height: 100%; }
            .contact { margin-top: 0 !important; }
          }
        `}
      </style>

      <Grid
        container
        sx={{ width: "100%", margin: 0 }}
        columnSpacing={{ xs: 0, md: 6 }}
        rowSpacing={{ xs: 4, md: 0 }}
        alignItems="center"
      >
        {/* IZQUIERDA — info */}
        <Grid item xs={12} md={6}>
          <Typography
            sx={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: { xs: "0.62rem", md: "0.72rem" },
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.55)",
              mb: { xs: 1, md: 1.6 },
            }}
          >
            CONTACTO
          </Typography>

          <Typography
            component="h1"
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontSize: { xs: "1.9rem", sm: "2.3rem", md: "3rem", lg: "3.5rem" },
              fontWeight: 400,
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
              mb: { xs: 1.5, md: 2.2 },
            }}
          >
            ¿Qué necesita tu próxima obra?
          </Typography>

          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontSize: { xs: "0.95rem", md: "1.08rem" },
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.82)",
              maxWidth: "500px",
              mb: { xs: 2, md: 2.6 },
            }}
          >
            Cada proyecto presenta desafíos diferentes. Contanos qué necesitas
            y te ayudamos a encontrar una solución de acero que permita
            optimizar tiempos, procesos y recursos.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              mb: { xs: 2.5, md: 4 },
            }}
          >
            {["Hablemos de tu proyecto", "Solicitar una cotización"].map(
              (label) => (
                <Button
                  key={label}
                  disableElevation
                  onClick={() =>
                    formRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    })
                  }
                  sx={{
                    bgcolor: "#fff",
                    color: "#111",
                    borderRadius: 0,
                    px: 2.4,
                    py: 1.1,
                    fontFamily: "'Geist Mono', monospace",
                    fontWeight: 700,
                    fontSize: { xs: "0.62rem", md: "0.7rem" },
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    "&:hover": { bgcolor: "#EE2737", color: "#fff" },
                  }}
                >
                  {label}
                </Button>
              )
            )}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, md: 2.6 } }}>
            {infoItems.map((item) => (
              <Box key={item.label} sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#fff",
                    color: "#111",
                    borderRadius: "3px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
                  }}
                >
                  {item.icon}
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: { xs: "0.6rem", md: "0.68rem" },
                      letterSpacing: "0.14em",
                      color: "rgba(255,255,255,0.6)",
                      mb: 0.3,
                    }}
                  >
                    {item.label}
                  </Typography>
                  {item.lines.map((line) =>
                    line.href ? (
                      <Typography
                        key={line.text}
                        component="a"
                        href={line.href}
                        target={line.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        sx={{
                          display: "block",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: { xs: "0.88rem", md: "0.96rem" },
                          lineHeight: 1.5,
                          color: "#fff",
                          textDecoration: "none",
                          transition: "color 0.2s",
                          "&:hover": { color: "#EE2737" },
                        }}
                      >
                        {line.text}
                      </Typography>
                    ) : (
                      <Typography
                        key={line.text}
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: { xs: "0.88rem", md: "0.96rem" },
                          lineHeight: 1.5,
                          color: "#fff",
                        }}
                      >
                        {line.text}
                      </Typography>
                    )
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>

        {/* DERECHA — card blanca con esquina inferior derecha cortada */}
        <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: { md: "flex-end" } }}>
          <Box
            component="form"
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            sx={{
              bgcolor: "#fff",
              color: "#111",
              width: "100%",
              maxWidth: { md: "620px" },
              mr: { md: "26px" },
              boxSizing: "border-box",
              px: CARD_PAD_X,
              pt: { xs: "26px", md: "32px" },
              pb: { xs: "40px", md: "54px" },
              overflow: "hidden",
              clipPath: {
                xs: "polygon(0 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%)",
                md: "polygon(0 0, 100% 0, 100% calc(100% - 36px), calc(100% - 36px) 100%, 0 100%)",
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontSize: { xs: "1.05rem", md: "1.22rem" },
                fontWeight: 600,
                whiteSpace: { md: "nowrap" },
                letterSpacing: "-0.02em",
                color: "#111",
                mb: 0.8,
              }}
            >
              Compartinos los principales datos de tu proyecto
            </Typography>

            <Typography
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontSize: { xs: "0.82rem", md: "0.9rem" },
                lineHeight: 1.5,
                color: "#666",
                maxWidth: { md: "380px" },
                mb: { xs: 2, md: 2.4 },
              }}
            >
              Nuestro equipo se pondrá en contacto para orientarte sobre la
              solución más adecuada.
            </Typography>

            {success && (
              <Alert
                severity="success"
                sx={{
                  mb: 2,
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
              columnSpacing={{ xs: 1.5, md: 2 }}
              rowSpacing={{ xs: 1.5, md: 1.6 }}
            >
              <Grid item xs={12} sm={6}>
                <Typography sx={labelStyle}>NOMBRE</Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="Nombre"
                  name="name"
                  defaultValue=""
                  error={!!errors.name}
                  sx={textFieldStyle}
                />
                {!!errors.name && (
                  <Typography
                    sx={{
                      color: "#EE2737",
                      fontSize: "0.68rem",
                      mt: 0.3,
                      fontFamily: "'Geist Mono', monospace",
                    }}
                  >
                    {errors.name}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={labelStyle}>EMAIL</Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="Email"
                  name="email"
                  defaultValue=""
                  error={!!errors.email}
                  sx={textFieldStyle}
                />
                {!!errors.email && (
                  <Typography
                    sx={{
                      color: "#EE2737",
                      fontSize: "0.68rem",
                      mt: 0.3,
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
                  defaultValue=""
                  sx={textFieldStyle}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography sx={labelStyle}>PRODUCTOS Y SERVICIOS</Typography>
                <Select
                  multiple
                  fullWidth
                  displayEmpty
                  variant="standard"
                  name="services"
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  error={!!errors.services}
                  IconComponent={KeyboardArrowDownRoundedIcon}
                  renderValue={(selected) =>
                    selected.length === 0 ? (
                      <span style={{ color: "#9a9a9a" }}>
                        Seleccioná uno o varios
                      </span>
                    ) : (
                      selected.join(", ")
                    )
                  }
                  MenuProps={{
                    disableScrollLock: true,
                    transitionDuration: 260,
                    anchorOrigin: { vertical: "bottom", horizontal: "left" },
                    transformOrigin: { vertical: "top", horizontal: "left" },
                    PaperProps: {
                      elevation: 0,
                      sx: {
                        mt: 1,
                        borderRadius: "6px",
                        border: "1px solid #ececec",
                        boxShadow: "0 12px 34px rgba(0,0,0,0.14)",
                        maxHeight: 300,
                        "& .MuiList-root": { py: 0.5 },
                        "& .MuiMenuItem-root": {
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.9rem",
                          py: 1,
                          transition: "background-color 0.18s ease",
                          "&:hover": { bgcolor: "#f5f5f5" },
                          "&.Mui-selected": { bgcolor: "#fbeaec" },
                          "&.Mui-selected:hover": { bgcolor: "#f7dfe2" },
                        },
                      },
                    },
                  }}
                  sx={{
                    "&:before": { borderColor: "#d9d9d9" },
                    "&:hover:not(.Mui-disabled):before": { borderColor: "#b5b5b5" },
                    "&:after": { borderColor: "#EE2737" },
                    "& .MuiSelect-select": {
                      color: "#111",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: { xs: "0.92rem", md: "1rem" },
                      py: 0.6,
                    },
                    "& .MuiSelect-icon": {
                      color: "#888",
                      transition: "transform 0.28s ease",
                    },
                    "& .MuiSelect-icon.MuiSelect-iconOpen": {
                      transform: "rotate(180deg)",
                    },
                  }}
                >
                  {servicesList.map((s) => (
                    <MenuItem key={s} value={s}>
                      <Checkbox
                        checked={services.includes(s)}
                        size="small"
                        sx={{
                          p: 0.5,
                          mr: 1,
                          color: "#ccc",
                          "&.Mui-checked": { color: "#EE2737" },
                        }}
                      />
                      <ListItemText primary={s} />
                    </MenuItem>
                  ))}
                </Select>
                {!!errors.services && (
                  <Typography
                    sx={{
                      color: "#EE2737",
                      fontSize: "0.68rem",
                      mt: 0.3,
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
                  rows={2}
                  defaultValue=""
                  sx={{ ...textFieldStyle, "& textarea": { resize: "none" } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography sx={labelStyle}>
                  ADJUNTAR PLANO, LISTADO O ARCHIVO (OPCIONAL)
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Button
                    disableElevation
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      border: "1px solid #d9d9d9",
                      borderRadius: 0,
                      color: "#111",
                      px: 1.8,
                      py: 0.6,
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: "0.62rem",
                      letterSpacing: "0.08em",
                      "&:hover": { borderColor: "#EE2737", bgcolor: "transparent" },
                    }}
                  >
                    SELECCIONAR ARCHIVO
                  </Button>
                  <Typography
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.8rem",
                      color: attachedFile ? "#111" : "#9a9a9a",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {attachedFile ? attachedFile.name : "Ningún archivo seleccionado"}
                  </Typography>
                </Box>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.dwg,.dxf,.xls,.xlsx,.doc,.docx,.png,.jpg,.jpeg,.zip"
                  style={{ display: "none" }}
                  onChange={(e) => setAttachedFile(e.target.files?.[0] || null)}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  sx={{ ml: -0.45, mr: 0 }}
                  control={
                    <Checkbox
                      size="small"
                      sx={{
                        color: "#bbb",
                        p: 0.5,
                        "&.Mui-checked": { color: "#EE2737" },
                      }}
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      name="agree"
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        color: errors.agree ? "#EE2737" : "#888",
                        fontFamily: "'Geist Mono', monospace",
                        fontSize: { xs: "0.54rem", md: "0.6rem" },
                        lineHeight: 1.2,
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
              </Grid>
            </Grid>

            {/* Botón separado dentro de la card, con su propio corte
                inferior derecho alineado (misma pendiente) al de la card */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation
              sx={{
                mt: { xs: 2, md: 2.2 },
                bgcolor: "#111",
                color: "#fff",
                py: { xs: 1.5, md: 1.7 },
                borderRadius: 0,
                boxShadow: "none",
                fontFamily: "'Geist Mono', monospace",
                fontWeight: 700,
                fontSize: { xs: "0.7rem", md: "0.8rem" },
                letterSpacing: "0.08em",
                transition: "background-color 0.25s ease",
                clipPath: {
                  xs: "polygon(0 0, 100% 0, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0 100%)",
                  md: "polygon(0 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%)",
                },
                "&:hover": { bgcolor: "#EE2737", boxShadow: "none" },
              }}
            >
              ENVIAR CONSULTA
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactComponent;
