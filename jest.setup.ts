import "@testing-library/jest-dom";
import ResizeObserver from "resize-observer-polyfill";

global.ResizeObserver = ResizeObserver;

window.HTMLElement.prototype.hasPointerCapture = () => false;
window.HTMLElement.prototype.releasePointerCapture = jest.fn();
window.HTMLElement.prototype.scrollIntoView = jest.fn();
