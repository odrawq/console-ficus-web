/*
 * Copyright (C) 2024 qwardo <odrawq.qwardo@gmail.com>
 *
 * This file is part of Console Ficus Web.
 *
 * Console Ficus Web is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Console Ficus Web is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Console Ficus Web. If not, see <http://www.gnu.org/licenses/>.
 */

const _window = document.getElementById("window");

/**
 * Prints text into the "window" element.
 *
 * @param {string} text - Text to print.
 * @param {("stdin" | "stdout" | "stderr")} [type="stdout"] - The type of text. "stdout" by default.
 */
export function printw(text, type = "stdout")
{
    const span = document.createElement("span");
    span.textContent = text;
    span.className = type;

    _window.appendChild(span);
    _window.scrollTop = _window.scrollHeight;
}

/**
 * Clears the "window" element text.
 */
export function clearw()
{
    _window.textContent = "";
}
