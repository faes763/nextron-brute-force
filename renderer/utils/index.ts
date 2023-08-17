import { ipcRenderer } from "electron";
import ColorThief from 'colorthief';

export const copyText = async(text:string)=> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        return false;
    }
}

const regex = /url\('([^']+)'\)/;
const badColors = [180,198,161,188,181]
export const changeRoot = async(name:string,property:string) =>{
    const body = document.body;
    body.style.setProperty('--' + name, property);
    ipcRenderer.invoke('change-config', name, property);

    if(property.includes('images')) {
        const img = new Image();
        const match = property.match(regex);
        img.src = match[1];
        img.onload = function() {
            const colorThief = new ColorThief();
            const dominantColor = colorThief.getColor(img);
            const brightness = (dominantColor[0] + dominantColor[1] + dominantColor[2]) / 3;
            if (brightness > 212 || badColors.includes(Math.floor(brightness)) ) {
                body.style.setProperty('--main-text-color', '0, 0, 0');
                ipcRenderer.invoke('change-config', 'main-text-color', '0, 0, 0');
            } else {
                body.style.setProperty('--main-text-color', '256, 256, 256');
                ipcRenderer.invoke('change-config', 'main-text-color', '256, 256, 256');
            }
        }   
    }
   
}

