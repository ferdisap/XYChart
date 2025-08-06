export function CreateDomElement(elementType: string, className: string = '', innerHTML: string = ''): HTMLElement {
    let element = document.createElement(elementType);
    if (className) {
        element.className = className;
    }
    if (innerHTML) {
        element.innerHTML = innerHTML;
    }
    return element;
}

export function AddDomElement(parentElement: HTMLElement, elementType: string, className: string = '', innerHTML: string = ''): HTMLElement {
    let element = CreateDomElement(elementType, className, innerHTML);
    parentElement.appendChild(element);
    return element;
}

export function AddDiv(parentElement: HTMLElement, className: string = '', innerHTML: string = ''): HTMLDivElement {
    return AddDomElement(parentElement, 'div', className, innerHTML) as HTMLDivElement;
}

export function AddButton(parentElement: HTMLElement, svg: string, title: string, classNames: Array<string>, onClick: Function|null): HTMLDivElement {
    const butonDiv = AddDiv(parentElement, "wab-toolbar-btn-container");
    const button = CreateDomElement('button', "wab-toolbar-btn-image", svg);
    for (let className of classNames) {
        button.classList.add(className);
    }
    butonDiv.setAttribute("alt", title);
    butonDiv.appendChild(button);
    if(onClick) button.addEventListener('click', onClick as EventListenerOrEventListenerObject)
    return butonDiv;
}

export function InsertDomElementBefore(newElement: HTMLElement, existingElement: HTMLElement) {
    if (existingElement.parentNode) existingElement.parentNode.insertBefore(newElement, existingElement);
}

export function InsertDomElementAfter(newElement: HTMLElement, existingElement: HTMLElement) {
    if (existingElement.parentNode) existingElement.parentNode.insertBefore(newElement, existingElement.nextSibling);
}