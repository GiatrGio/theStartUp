import "./header.css";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { State } from "../../state";
import { Modal } from "../commonComponents/formModal/modal";
import { Login } from "../loginPage/login";

export const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isLogInModalOpen, setIsLogInModalOpen] = useState(false);
  const open = Boolean(anchorEl);

  const openLogInModal = () => {
    setIsLogInModalOpen(true);
  };

  const closeLogInModal = () => {
    setIsLogInModalOpen(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const currentUser = useSelector((state: State) => state.user);
  return (
    <div className="top">
      <div className="topLeft"></div>
      <div className="topCenter">
        <ul>
          <li>HOME</li>
          <li>ABOUT</li>
          <li>CONTACT</li>
          <li>WRITE</li>
        </ul>
      </div>
      <div className="topRight">
        <React.Fragment>
          <Box
            sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
          >
            <Typography sx={{ minWidth: 100 }}>Whatever</Typography>
            <Typography sx={{ minWidth: 100 }}>Profile</Typography>
            {currentUser !== null ? (
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                </IconButton>
              </Tooltip>
            ) : (
              <div>
                <button onClick={() => openLogInModal()}>Log in</button>
                <Modal
                  isOpen={isLogInModalOpen}
                  onClose={closeLogInModal}
                  children={
                    <div className={"modalBox"}>
                      <Login />
                    </div>
                  }
                ></Modal>
              </div>
            )}
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem>
              <Avatar /> Profile
            </MenuItem>
            <MenuItem>
              <Avatar /> My account
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemIcon>
                <PersonAdd fontSize="small" />
              </ListItemIcon>
              Add another account
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </React.Fragment>
      </div>
    </div>
  );
};
