const { app, BrowserWindow, ipcMain } = require('electron');
const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS,
} = require('electron-devtools-installer');
const path = require('path');
const isDev = require('electron-is-dev');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const getIcon = () => {
    if (process.platform === 'win32')
        return `${path.join(__dirname, '/icons/icon.ico')}`;
    if (process.platform === 'darwin')
        return `${path.join(__dirname, '/icons/icon.icns')}`;
    return `${path.join(__dirname, '/icons/16x16.png')}`;
};

let mainWindow;

const createWindow = async () => {
    mainWindow = new BrowserWindow({
        title: 'Radion Browser',
        width: 980,
        height: 750,
        minWidth: 340,
        minHeight: 220,
        frame: false,
        show: false,
        focusable: true,
        fullscreenable: false,
        alwaysOnTop: false,
        icon: getIcon(),
        backgroundColor: '#1b212e',
        webPreferences: {
            webviewTag: true,
            nodeIntegration: true,
            enableRemoteModule: true,
            webSecurity: false,
        },
    });

    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`,
    );

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();

        mainWindow.webContents.send('urlOpen', '', '', '');

        if (isDev) {
            installExtension(REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS);
            mainWindow.webContents.openDevTools();
        }
    });

    mainWindow.on('closed', () => (mainWindow = null));
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('on-top-browser', (event, args) => {
    mainWindow.setAlwaysOnTop(args);
});

ipcMain.on('channalOne', (event, args) => {
    event.sender.send('channalOne', 'Message resieved on the main process');
});
