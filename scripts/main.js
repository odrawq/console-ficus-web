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

import { printw } from "./window.js";
import Executor from "./executor.js";

const configFilePath = "config/config.json";

fetch(configFilePath)
    .then(response =>
    {
        if (!response.ok)
            throw new Error(`не удалось загрузить ${configFilePath} (${response.statusText})`);

        return response.json();
    })
    .then(config =>
    {
        const executor = new Executor(config);

        document.getElementById("input-field").addEventListener("keypress", function(event)
        {
            if (event.key === "Enter")
            {
                event.preventDefault();
                printw(`>>> ${this.value}\n`, "stdin");
                executor.exec(this.value);
                this.value = "";
            }
        });

        printw("Console Ficus Web\n" +
               'Напишите "h" или "help" для получения дополнительной информации.\n');
    })
    .catch(error =>
    {
        printw(`Фатальная ошибка: ${error.message}\n`, "stderr");
        document.getElementById("input-field").style.display = "none";
    });
