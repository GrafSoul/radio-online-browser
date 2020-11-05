import React, { useState, useEffect } from 'react';
import classes from './App.module.scss';

const { remote } = window.require('electron');
const mainWindow = remote.getCurrentWindow();

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

const App = () => {
    const [status, setStatus] = useState(false);
    const [id, setId] = useState('');
    const [title, setTitle] = useState('Radion Browser');
    const [url, setUrl] = useState('Invalid URL or Not connection!');
    const [isLoading, setLoading] = useState(false);
    const [webview, setWebview] = useState(document.querySelector('webview'));
    const [isTop, setIsTop] = useState(false);

    useEffect(() => {
        setWebview(document.querySelector('webview'));

        ipcRenderer.on('urlOpen', (event, id, title, url) => {
            let valid = /^(ftp|http|https):\/\/[^ "]+$/.test(url);
            if (url.length !== 0 && valid) {
                setId(id);
                setTitle(title);
                setUrl(url);
            }
        });
    }, []);

    const handleGoBack = () => {
        webview.goBack();
    };

    const handleGoForward = () => {
        webview.goForward();
    };

    const handleReload = () => {
        if (isLoading) {
            webview.stop();
            setLoading(false);
        } else {
            webview.reload();
            setLoading(true);
        }
    };

    const handleMinimizeWindow = () => {
        mainWindow.minimize();
    };

    const handleMaximizeWindow = () => {
        if (status) {
            mainWindow.unmaximize();
            setStatus(!status);
        } else {
            mainWindow.maximize();
            setStatus(!status);
        }
    };

    const handleCloseWindow = () => {
        ipcRenderer.send('closeWindow', id);
        mainWindow.close();
    };

    const handlerTopWindow = (id) => {
        ipcRenderer.send('on-top-browser', id, true);
        setIsTop(!isTop);
    };

    const handlerDownWindow = (id) => {
        ipcRenderer.send('on-top-browser', id, false);
        setIsTop(!isTop);
    };

    return (
        <div className={classes.layout}>
            <div className={classes.topbarWrap}>
                <div className={classes.topbar}>
                    <div>
                        <button
                            className={classes.btnWindow}
                            onClick={handleGoBack}
                        >
                            <i className="fal fa-chevron-circle-left" />
                        </button>
                        <button
                            className={classes.btnWindow}
                            onClick={handleGoForward}
                        >
                            <i className="fal fa-chevron-circle-right" />
                        </button>
                        <button
                            className={classes.btnWindow}
                            onClick={handleReload}
                        >
                            <i className="fal fa-sync" />
                        </button>
                    </div>
                    <div className={classes.title}>
                        {title} - <span>{url}</span>
                    </div>
                    <div>
                        {isTop ? (
                            <button
                                className={classes.btnWindow}
                                onClick={() => handlerDownWindow(id)}
                                title="Unpin on top of all"
                            >
                                <i className="fal fa-arrow-from-top"></i>
                            </button>
                        ) : (
                            <button
                                className={classes.btnWindow}
                                onClick={() => handlerTopWindow(id)}
                                title="Pin on top of all"
                            >
                                <i className="fal fa-arrow-to-top"></i>
                            </button>
                        )}
                        <button
                            className={classes.btnWindow}
                            onClick={handleMinimizeWindow}
                        >
                            <i className="fal fa-window-minimize" />
                        </button>
                        <button
                            className={classes.btnWindow}
                            onClick={handleMaximizeWindow}
                        >
                            <i className="fal fa-window-maximize" />
                        </button>
                        <button
                            className={
                                classes.btnWindow + ' ' + classes.closeWindow
                            }
                            onClick={handleCloseWindow}
                        >
                            <i className="fal fa-window-close" />
                        </button>
                    </div>
                </div>
            </div>

            <main className={classes.content}>
                {url !== 'Invalid URL or Not connection!' ? (
                    <webview
                        src={url}
                        className={classes.webviewContainer}
                    ></webview>
                ) : null}
            </main>
        </div>
    );
};

export default App;
