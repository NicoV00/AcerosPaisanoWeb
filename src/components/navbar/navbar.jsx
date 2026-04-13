import React, { useState, useEffect, useRef, useMemo } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import GlobalStyles from "@mui/material/GlobalStyles";

import { Link } from "react-router-dom";

const AnimatedMenuIcon = ({ isOpen, isDark = false }) => (
  <Box
    sx={{
      width: "36px",
      height: "36px",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Box
      sx={{
        width: "30px",
        height: "3px",
        backgroundColor: isOpen
          ? "#FFFFFF"
          : isDark
            ? "rgba(11, 11, 11, 0.85)"
            : "rgba(255, 255, 255, 0.9)",
        position: "absolute",
        transition: "all 0.3s ease",
        transform: isOpen ? "rotate(45deg)" : "translateY(-6px)",
        boxShadow: isOpen ? "0 0 5px #FFFFFF" : "none",
      }}
    />
    <Box
      sx={{
        width: "30px",
        height: "3px",
        backgroundColor: isOpen
          ? "#FFFFFF"
          : isDark
            ? "rgba(11, 11, 11, 0.85)"
            : "rgba(255, 255, 255, 0.9)",
        position: "absolute",
        transition: "all 0.3s ease",
        transform: isOpen ? "rotate(-45deg)" : "translateY(6px)",
        boxShadow: isOpen ? "0 0 5px #FFFFFF" : "none",
      }}
    />
  </Box>
);

export const NavBar = ({ whiteBackground = false, disableInitialHidden = false, disableScrollHide = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));

  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(!disableInitialHidden);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [delayedHidden, setDelayedHidden] = useState(hidden);

  const appBarRef = useRef(null);
  const [navHeight, setNavHeight] = useState(76);
  const scrollYRef = useRef(0);

  // ✅ Geist Mono stack
  const navMono = useMemo(
    () =>
      `"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
    []
  );

  // tamaños
  const webNavFontSize = useMemo(() => "15px", []);
  const mobileDrawerFontSize = useMemo(() => "14px", []);

  useEffect(() => {
    if (hidden) {
      const timeout = setTimeout(() => setDelayedHidden(true), 2000);
      return () => clearTimeout(timeout);
    } else {
      setDelayedHidden(false);
    }
  }, [hidden]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    if (disableInitialHidden) return; // ✅ Skip timeout if already visible
    const timer = setTimeout(() => setHidden(false), 1000);
    return () => clearTimeout(timer);
  }, [disableInitialHidden]);

  useEffect(() => {
    const handleScroll = () => {
      if (menuOpen || disableScrollHide) return; // ✅ Skip hiding if disabled
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) setHidden(true);
      else setHidden(false);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, menuOpen]);

  // ✅ inject Geist Mono


  useEffect(() => {
    if (menuOpen) setHidden(false);
  }, [menuOpen]);

  // medir altura navbar
  useEffect(() => {
    const measure = () => {
      if (!appBarRef.current) return;
      const h = appBarRef.current.getBoundingClientRect().height;
      if (h && Math.abs(h - navHeight) > 1) setNavHeight(Math.round(h));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, menuOpen]);

  // lock scroll (iOS friendly)
  useEffect(() => {
    const html = document.documentElement;

    if (menuOpen) {
      scrollYRef.current = window.scrollY;

      html.style.overscrollBehavior = "none";
      html.style.backgroundColor = "#000";
      document.body.style.backgroundColor = "#000";

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    } else {
      const y = scrollYRef.current;

      html.style.overscrollBehavior = "";
      html.style.backgroundColor = "";
      document.body.style.backgroundColor = "";

      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";

      window.scrollTo(0, y);
    }
  }, [menuOpen]);

  const navItems = [
    { title: "Inicio", path: "/" },
    { title: "Sobre nosotros", path: "/sobre-nosotros" },
    { title: "Productos", path: "/productos" },
    { title: "Contacto", path: "/contacto" },
  ];

  const handleNavClick = () => {
    scrollYRef.current = 0; // Reset stored scroll to avoid restoring to a previous position when closing menu
    window.scrollTo(0, 0);
    if (menuOpen) setMenuOpen(false);
  };

  return (
    <>
      <GlobalStyles
        styles={{
          "button:focus, a:focus": { outline: "none" },
          "a, button": { WebkitTapHighlightColor: "transparent" },
        }}
      />

      <Box
        sx={{
          position: "fixed",
          right: "auto",
          zIndex: menuOpen ? 2200 : delayedHidden ? -1 : 100,
          width: "100vw",
          height: "100px",
        }}
      >
        <AppBar
          ref={appBarRef}
          position="fixed"
          sx={{
            right: "auto",
            width: "100vw",
            padding: { xs: "6px 24px", md: "3px 3.5vw" },
            transition: "transform 0.4s ease-in-out, background-color 0.3s ease-in-out",
            transform: hidden && !menuOpen ? "translateY(-100%)" : "translateY(0)",

            /* ✅ SIN glass en secciones oscuras/transparente
               ✅ SOLO blanco en vistas whiteBackground */
            backgroundColor: menuOpen
              ? "#000000"
              : whiteBackground
                ? "rgba(255, 255, 255, 0.96)"
                : "transparent",

            /* ✅ blur solo para fondos blancos */
            backdropFilter: menuOpen ? "none" : whiteBackground ? "blur(10px)" : "none",
            WebkitBackdropFilter: menuOpen ? "none" : whiteBackground ? "blur(10px)" : "none",

            boxShadow: "none",
            borderBottom: whiteBackground && !menuOpen ? "1px solid rgba(11, 11, 11, 0.06)" : "none",
            zIndex: 2201,
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: 0,
              minHeight: isMobile ? "60px" : "70px",
            }}
          >
            <Button
              component={Link}
              to="/"
              onClick={handleNavClick}
              color="inherit"
              sx={{ padding: "0px", minWidth: "auto" }}
            >
              <Box
                component="img"
                src="/images/logo-small.png"
                alt="Logo"
                fetchPriority="high"
                sx={{ height: isMobile ? 40 : 50 }}
              />
            </Button>

            {/* WEB NAV */}
            {!isMobile && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: isTablet ? "65%" : "45%",
                  flexWrap: isTablet ? "wrap" : "nowrap",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: isTablet ? "space-around" : "space-between",
                    width: isTablet ? "100%" : "70%",
                    mb: isTablet ? 1 : 0,
                  }}
                >
                  {navItems.slice(0, 3).map((item, index) => (
                    <Button
                      key={index}
                      component={Link}
                      to={item.path}
                      onClick={handleNavClick}
                      color="inherit"
                      sx={{
                        textTransform: "none",
                        padding: "6px 10px",
                        minWidth: "auto",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: navMono, // ✅ Geist Mono
                          fontSize: webNavFontSize,
                          fontWeight: 400,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: whiteBackground
                            ? "rgba(11, 11, 11, 0.7)"
                            : "rgba(255, 255, 255, 0.75)",
                          transition: "color 0.3s ease",
                          "&:hover": {
                            color: whiteBackground ? "rgba(11, 11, 11, 0.95)" : "white",
                          },
                          lineHeight: 1,
                        }}
                      >
                        {item.title}
                      </Typography>
                    </Button>
                  ))}
                </Box>

                {!isTablet && (
                  <Button
                    component={Link}
                    to="/contacto"
                    onClick={handleNavClick}
                    color="inherit"
                    sx={{
                      textTransform: "none",
                      padding: "6px 10px",
                      minWidth: "auto",
                      marginRight: "-10px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: navMono, // ✅ Geist Mono
                        fontSize: webNavFontSize,
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: whiteBackground
                          ? "rgba(11, 11, 11, 0.7)"
                          : "rgba(255, 255, 255, 0.75)",
                        transition: "color 0.3s ease",
                        "&:hover": {
                          color: whiteBackground ? "rgba(11, 11, 11, 0.95)" : "white",
                        },
                        lineHeight: 1,
                      }}
                    >
                      Contacto
                    </Typography>
                  </Button>
                )}
              </Box>
            )}

            {/* MOBILE HAMBURGER */}
            {isMobile && (
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleMenu}
                sx={{
                  color: whiteBackground ? "rgba(11, 11, 11, 0.85)" : "white",
                  padding: 1,
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                <AnimatedMenuIcon isOpen={menuOpen} isDark={whiteBackground} />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        {/* Drawer debajo de navbar */}
        <Drawer
          anchor="bottom"
          open={menuOpen}
          onClose={toggleMenu}
          hideBackdrop
          ModalProps={{
            keepMounted: true,
            disableScrollLock: true,
          }}
          sx={{
            zIndex: 2190,
            pointerEvents: "none",
            "& .MuiDrawer-paper": { pointerEvents: "auto" },
          }}
          PaperProps={{
            sx: {
              width: "100%",
              top: `${navHeight}px`,
              height: `calc(100vh - ${navHeight}px)`,
              backgroundColor: "#000000",
              backgroundImage: "none",
              color: "white",
              overflow: "hidden",
              overscrollBehavior: "none",
              WebkitTapHighlightColor: "transparent",
              borderTopLeftRadius: "0",
              borderTopRightRadius: "0",
              boxShadow: "none",
              borderTop: "none",
              margin: 0,
            },
          }}
          transitionDuration={{ enter: 500, exit: 500 }}
          SlideProps={{ direction: "up" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "100%",
              alignItems: "flex-start",
              justifyContent: "flex-end",
              paddingLeft: "16px",
              paddingRight: "16px",
              paddingBottom: "12vh",
            }}
          >
            <List sx={{ width: "100%", padding: 0, margin: 0 }}>
              {navItems.map((item, index) => (
                <ListItem
                  key={index}
                  sx={{
                    padding: "10px 0",
                    justifyContent: "flex-start",
                    width: "auto",
                  }}
                >
                  <ListItemText
                    primary={
                      <Button
                        component={Link}
                        to={item.path}
                        color="inherit"
                        onClick={handleNavClick}
                        sx={{
                          padding: 0,
                          minWidth: "auto",
                          justifyContent: "flex-start",
                          "&:hover": { backgroundColor: "transparent" },
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: navMono, // ✅ Geist Mono
                            fontWeight: 500,
                            fontSize: '24px',
                            letterSpacing: "0.06em",
                            lineHeight: 0.98,
                            textTransform: "uppercase",
                            textShadow: "none",
                          }}
                        >
                          {item.title}
                          {item.title === "Productos" && (
                            <sup style={{ fontSize: "14px", marginLeft: "6px" }}>9</sup>
                          )}
                        </Typography>
                      </Button>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>
    </>
  );
};

export default NavBar;
