/**
 * @author    carlosperate
 * @copyright 2015 carlosperate https://github.com/carlosperate
 * @license   Licensed under the The MIT License (MIT), a copy can be found in
 *            the electron project directory LICENSE file.
 *
 * @fileoverview Generates the application menu bar.
 */
const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const shell = electron.shell;
const dialog = electron.dialog;
const MenuItem = electron.MenuItem;
const BrowserWindow = electron.BrowserWindow;

const server = require('./servermgr.js');

module.exports.setArdublocklyMenu = function(devMode) {
    if (typeof(devMode)==='undefined') devMode = false;

    var ardublocklyMenu = [];
    if (process.platform == 'darwin') {
        ardublocklyMenu.push(getMacMenuData());
    }
    ardublocklyMenu.push(getFileMenuData());
    ardublocklyMenu.push(getEditMenuData());
    ardublocklyMenu.push(getProgramMenuData());
    ardublocklyMenu.push(getExamplesMenuData());
    if (process.platform == 'darwin') {
        ardublocklyMenu.push(getWindowMenuData());
    }
    ardublocklyMenu.push(getHelpMenuData());

    if (devMode) {
        ardublocklyMenu.push(getDevMenuData());
    }

    Menu.setApplicationMenu(Menu.buildFromTemplate(ardublocklyMenu));
};

var getMacMenuData = function() {
    return {
        label: '이노로이드 브로코리',
        submenu: [
            {
                label: '정보',
                click: functionNotImplemented
            }, {
                type: 'separator'
            }, {
                label: '설정',
                accelerator: 'CmdOrCtrl+,',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript('Ardublockly.openSettings()');
                }
            }, {
                type: 'separator'
            }, {
                label: '서비스',
                submenu: []
            }, {
                type: 'separator'
            }, {
                label: '가리기',
                accelerator: 'Command+H',
                selector: 'hide:'
            }, {
                label: '다른창 가리기',
                accelerator: 'Command+Shift+H',
                selector: 'hideOtherApplications:'
            }, {
                label: '모두 보이기',
                selector: 'unhideAllApplications:'
            }, {
                type: 'separator'
            }, {
                label: '종료',
                accelerator: 'CmdOrCtrl+Q',
                click: function() {
                    app.quit();
                }
            }
        ]
    };
};

var getFileMenuData = function() {
    var fileMenu = {
        label: '파일',//File
        submenu: [
            {
                label: '새로만들기',//New
                accelerator: 'CmdOrCtrl+N',
                click: functionNotImplemented
            }, {
                label: '열기',//Open
                accelerator: 'CmdOrCtrl+O',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript(
                            'Ardublockly.loadUserXmlFile()', true);
                }
            }, {
                label: '블럭을 다른이름으로 저장',
                accelerator: 'CmdOrCtrl+S',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript('Ardublockly.saveXmlFile()');
                }
            }, {
                label: '스케치를 다른이름으로 저장',
                accelerator: 'Shift+CmdOrCtrl+S',
                click:  function() {
                    BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript('Ardublockly.saveSketchFile()');
                }
            }
        ]
    };

    // On MacOS the Quit option is in the app menu, so only add it if not mac
    if (process.platform != 'darwin') {
        fileMenu.submenu.push(
            {
                type: 'separator'
            }, {
                label: '종료',//Quit
                accelerator: 'CmdOrCtrl+Q',
                click: function() {
                    app.quit();
                }
            }
        );
    }

    return fileMenu;
};

var getEditMenuData = function() {
    var editMenud = {
        label: '편집',
        submenu: [
            {
                label: '뒤로',
                accelerator: 'CmdOrCtrl+Z',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript('Ardublockly.workspace.undo(false)');
                }
            }, {
                label: '앞으로',
                accelerator: 'CmdOrCtrl+Y',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript('Ardublockly.workspace.undo(true)');
                }
            }, {
                type: 'separator'
            }, {
                label: '자르기',
                accelerator: 'CmdOrCtrl+X',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript('Ardublockly.blocklyCut()');
                }
            }, {
                label: '복사하기',
                accelerator: 'CmdOrCtrl+C',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript('Ardublockly.blocklyCopy()');
                }
            }, {
                label: '붙여넣기',
                accelerator: 'CmdOrCtrl+V',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript('Ardublockly.blocklyPaste()');
                }
            }, {
                label: '지우기',
                accelerator: 'Delete',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript('Ardublockly.blocklyDelete()');
                }
            }, {
                label: '모두 지우기',
                accelerator: 'Delete',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript('Ardublockly.discardAllBlocks()');
                }
            }
        ]
    };

    // On MacOS Preferences is in the app menu, so only add it if not mac
    if (process.platform != 'darwin') {
        editMenud.submenu.push(
            {
                type: 'separator'
            }, {
                label: '설정',
                accelerator: 'CmdOrCtrl+,',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript('Ardublockly.openSettings()');
                }
            }
        );
    }

    return editMenud;
};

var getExamplesMenuData = function() {
    return {
        label: '예제',
        submenu: [
            {
                label: 'LED Blink',
                click: function() {
                     BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript(
                            'Ardublockly.loadServerXmlFile("../examples/' +
                            'blink.xml");');
                }
            }, {
                label: 'Serial Print',
                click: function() {
                     BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript(
                            'Ardublockly.loadServerXmlFile("../examples/' +
                            'serial_print_ascii.xml");');
                }
            }, {
                label: 'Serial Repeat Game',
                click: function() {
                     BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript(
                            'Ardublockly.loadServerXmlFile("../examples/' +
                            'serial_repeat_game.xml");');
                }
            }, {
                label: 'Servo Knob',
                click: function() {
                     BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript(
                            'Ardublockly.loadServerXmlFile("../examples/' +
                            'servo_knob.xml");');
                }
            }, {
                label: 'Stepper Knob',
                click: function() {
                     BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript(
                            'Ardublockly.loadServerXmlFile("../examples/' +
                            'stepper_knob.xml");');
                }
            }
        ]
    };
};

var getProgramMenuData = function() {
    return {
        label: '프로그램',
        submenu: [
            {
                label: '통합환경에서 열기',
                //accelerator: 'CmdOrCtrl+O',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript('Ardublockly.ideSendOpen()');
                }
            }, {
                label: '검사',
                accelerator: 'CmdOrCtrl+R',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript('Ardublockly.ideSendVerify()');
                }
            }, {
                label: '업로드',
                accelerator: 'CmdOrCtrl+U',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript('Ardublockly.ideSendUpload()');
                }
            }
        ]
    };
};

var getWindowMenuData = function() {
    return {
        label: '윈도우',
        submenu: [
            {
                label: '최소화',
                accelerator: 'Command+M',
                selector: 'performMiniaturize:'
            }, {
                label: '닫기',
                accelerator: 'Command+W',
                selector: 'performClose:'
           }, {
                type: 'separator'
            }, {
                label: '모두 불러오기',
                selector: 'arrangeInFront:'
            }
        ]
    };
};

var getHelpMenuData = function() {
    return {
        label: '도움말',
        submenu: [
            {
                label: '빠른시작',
                click: function() {
                    shell.openExternal(
                        'http://localhost:8000/docs/Quick-Start');
                }
            }, {
                label: '매뉴얼',
                click: function() {
                    shell.openExternal('http://localhost:8000/docs/');
                }
            }, {
                type: 'separator'
            }, {
                label: '이노로이드 홈페이지',
                click: function() {
                    shell.openExternal('http://www.inoroid.com');
                }
            }, {
                label: '소스코드',
                click: function() {
                    shell.openExternal(
                        'https://github.com/carlosperate/ardublockly');
                }
            }, {
                label: '오류신고',
                click: function() {
                    shell.openExternal(
                        'http://www.inoroid.com');
                }
            }, {
                type: 'separator'
            },  {
                label: '프로그램 정보',
                click: function() {
                    shell.openExternal('http://localhost:8000/docs/About');
                }
            }
        ]
    };
};

var getDevMenuData = function() {
    return {
        label: '개발모드',
        submenu: [
            {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+F5',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents
                        .reloadIgnoringCache();
                }
            }, {
                label: 'Toggle DevTools',
                accelerator: 'F12',
                click: function() {
                    BrowserWindow.getFocusedWindow().toggleDevTools();
                }
            }, {
                type: 'separator'
            }, {
                label: 'Stop server',
                accelerator: 'Shift+CmdOrCtrl+S',
                click: server.stopServer
            }, {
                label: 'Restart server',
                accelerator: 'Shift+CmdOrCtrl+R',
                click: server.restartServer
            }, {
                type: 'separator'
            }, {
                label: 'Open side menu',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript(
                            '$(".button-collapse").sideNav("show")');
                }
            }, {
                label: 'Open extra blocks menu',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents
                        .executeJavaScript(
                            'Ardublockly.openExtraCategoriesSelect()');
                }
            }, {
                type: 'separator'
            },  {
                label: 'Test menu item',
                click: testFunction
            }
        ]
    };
};

var functionNotImplemented = function() {
    dialog.showMessageBox({
        type: 'info',
        title: 'Dialog',
        buttons: ['ok',],
        message: 'This functionality has not yet been implemented.'
    });
};

var testFunction = function() {
    // Here you can place any test code you'd like to test on a menu click
    functionNotImplemented();
};
