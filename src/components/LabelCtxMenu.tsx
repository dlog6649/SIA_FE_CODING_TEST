import React, { useEffect } from 'react';

export default function LabelCtxMenu() {
    useEffect(() => {
        console.log('LabelCtxMenu useEffect');
    });

    return (
        <div className="label-contextmenu">
            <div id="edit" className="item edit"><span className="item-name">Edit Class</span><span className="item-shortcut">(TBD)</span></div>
            <div id="cut" className="item cut"><span className="item-name">Cut</span><span className="item-shortcut">Ctrl + X</span></div>
            <div id="copy" className="item copy"><span className="item-name">Copy</span><span className="item-shortcut">Ctrl + C</span></div>
            <div id="paste" className="item paste"><span className="item-name">Paste</span><span className="item-shortcut">Ctrl + V</span></div>
            <div id="delete" className="item delete"><span className="item-name">Delete</span><span className="item-shortcut">Del</span></div>
        </div>
    );
}
