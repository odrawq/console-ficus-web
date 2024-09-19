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

import { printw, clearw } from "./window.js";

/**
 * Executor for executing commands.
 */
export default class Executor
{
    /**
     * Creates an instance of Executor.
     *
     * @param {Object} config - Configuration object.
     */
    constructor(config)
    {
        this._config = config;
        this._commands =
        {
            "c": this._clear.bind(this),
            "clear": this._clear.bind(this),
            "h": this._help.bind(this),
            "help": this._help.bind(this),
            "w": this._week.bind(this),
            "week": this._week.bind(this),
            "l": this._lessons.bind(this),
            "lessons": this._lessons.bind(this),
            "b": this._bells.bind(this),
            "bells": this._bells.bind(this),
            "t": this._time.bind(this),
            "time": this._time.bind(this)
        };

        if (this._config.autoexec)
        {
            this.exec(this._config.autoexec);
            printw("\n");
        }
    }

    /**
     * Executes commands.
     *
     * @param {string} commands - Commands to execute.
     */
    exec(commands)
    {
        for (let commandsGroup of commands.split(";"))
        {
            for (let command of commandsGroup.split("&&"))
            {
                command = command.trim();

                if (command)
                {
                    if (this._commands[command])
                    {
                        try
                        {
                            this._commands[command]();
                        }
                        catch (error)
                        {
                            printw(`${command}: произошла ошибка в процессе выполнения команды:\n${error}\n`, "stderr");
                            break;
                        }
                    }
                    else
                    {
                        printw(`${command}: команда не найдена\n`, "stderr");
                        break;
                    }
                }
            }
        }
    }

    /**
     * Clears the previous output.
     */
    _clear()
    {
        clearw();
    }

    /**
     * Prints the program manual.
     */
    _help()
    {
        printw("Программа информирует об учёбе посредством выполнения команд.\n\nКоманды:\n" +
               "c, clear - очистить консоль\n" +
               "h, help - вывести это руководство\n" +
               "w, week - вывести тип текущей недели\n" +
               "l, lessons - вывести расписание занятий\n" +
               "b, bells - вывести расписание звонков\n" +
               "t, time - вывести время до начала или конца текущего занятия\n\n" +
               "Операторы:\n" +
               "; - разделить команды\n" +
               "&& - разделить команды и прекратить выполнение при ошибке\n");
    }

    /**
     * Prints the current week type.
     */
    _week()
    {
        const currentDateTime = new Date();
        const startOfStudyDateTime = new Date(currentDateTime.getFullYear(), 8, 1);

        if (currentDateTime < startOfStudyDateTime)
            startOfStudyDateTime.setFullYear(currentDateTime.getFullYear() - 1);

        if (startOfStudyDateTime.getDay() === 0)
            startOfStudyDateTime.setDate(startOfStudyDateTime.getDate() + 1);

        const startOfWeekDateTime = new Date(startOfStudyDateTime);
        startOfWeekDateTime.setDate(startOfStudyDateTime.getDate() - ((startOfStudyDateTime.getDay() + 6) % 7));

        const daysSinceStart = Math.floor((currentDateTime - startOfWeekDateTime) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.floor(daysSinceStart / 7) + 1;

        printw((weekNumber % 2 === 0) ? "Знаменатель\n" : "Числитель\n");
    }

    /**
     * Prints the lessons schedule.
     */
    _lessons()
    {
        const currentWeekday = new Date().toLocaleDateString("en-GB", { weekday: "short" }).toLowerCase();
        const days =
        {
            "mon": "Понедельник",
            "tue": "Вторник",
            "wed": "Среда",
            "thu": "Четверг",
            "fri": "Пятница",
            "sat": "Суббота"
        };
        const groupedDaysByLessonsSchedule = {};

        for (let day in days)
        {
            if (!this._config.lessons[day])
                continue;

            const lessonsScheduleString = JSON.stringify(this._config.lessons[day]);

            if (groupedDaysByLessonsSchedule[lessonsScheduleString])
                groupedDaysByLessonsSchedule[lessonsScheduleString].push(days[day]);
            else
                groupedDaysByLessonsSchedule[lessonsScheduleString] = [days[day]];
        }

        if (days[currentWeekday])
        {
            for (let lessonsScheduleString in groupedDaysByLessonsSchedule)
            {
                if (groupedDaysByLessonsSchedule[lessonsScheduleString].includes(days[currentWeekday]))
                {
                    groupedDaysByLessonsSchedule[lessonsScheduleString] = groupedDaysByLessonsSchedule[lessonsScheduleString].map(day => day === days[currentWeekday] ? `${day} (сегодня)` : day);
                    break;
                }
            }
        }

        let isFirstOutput = true;

        for (let lessonsScheduleString in groupedDaysByLessonsSchedule)
        {
            if (!isFirstOutput)
                printw(`\n${groupedDaysByLessonsSchedule[lessonsScheduleString].join(", ")}:\n`);
            else
            {
                printw(`${groupedDaysByLessonsSchedule[lessonsScheduleString].join(", ")}:\n`);
                isFirstOutput = false;
            }

            const lessonsSchedule = JSON.parse(lessonsScheduleString);

            for (let lessonNum in lessonsSchedule)
                printw(`${lessonNum}: ${lessonsSchedule[lessonNum]}\n`);
        }
    }

    /**
     * Prints the bells schedule.
     */
    _bells()
    {
        const currentWeekday = new Date().toLocaleDateString("en-GB", { weekday: "short" }).toLowerCase();
        const days =
        {
            "mon": "Понедельник",
            "tue": "Вторник",
            "wed": "Среда",
            "thu": "Четверг",
            "fri": "Пятница",
            "sat": "Суббота"
        };
        const groupedDaysByBellsSchedule = {};

        for (let day in days)
        {
            if (!this._config.bells[day])
                continue;

            const bellsScheduleString = JSON.stringify(this._config.bells[day]);

            if (groupedDaysByBellsSchedule[bellsScheduleString])
                groupedDaysByBellsSchedule[bellsScheduleString].push(days[day]);
            else
                groupedDaysByBellsSchedule[bellsScheduleString] = [days[day]];
        }

        if (days[currentWeekday])
        {
            for (let bellsScheduleString in groupedDaysByBellsSchedule)
            {
                if (groupedDaysByBellsSchedule[bellsScheduleString].includes(days[currentWeekday]))
                {
                    groupedDaysByBellsSchedule[bellsScheduleString] = groupedDaysByBellsSchedule[bellsScheduleString].map(day => day === days[currentWeekday] ? `${day} (сегодня)` : day);
                    break;
                }
            }
        }

        let isFirstOutput = true;

        for (let bellsScheduleString in groupedDaysByBellsSchedule)
        {
            if (!isFirstOutput)
                printw(`\n${groupedDaysByBellsSchedule[bellsScheduleString].join(", ")}:\n`);
            else
            {
                printw(`${groupedDaysByBellsSchedule[bellsScheduleString].join(", ")}:\n`);
                isFirstOutput = false;
            }

            const bellsSchedule = JSON.parse(bellsScheduleString);

            for (let bellNum in bellsSchedule)
            {
                if (typeof bellsSchedule[bellNum] === "string")
                    printw(`${bellNum}: ${bellsSchedule[bellNum]}\n`);
                else if (typeof bellsSchedule[bellNum] === "object")
                    printw(`${bellNum}: ${bellsSchedule[bellNum][1]}, ${bellsSchedule[bellNum][2]}\n`);
            }
        }
    }

    /**
     * Prints the time before the start or end of current lesson.
     */
    _time()
    {
        const currentDateTime = new Date();
        const currentWeekday = currentDateTime.toLocaleDateString("en-GB", { weekday: "short" }).toLowerCase();

        if (currentWeekday === "sun" || !this._config.lessons[currentWeekday])
        {
            printw("Сегодня не учебный день\n");
            return;
        }

        const currentTime = currentDateTime.getHours() * 3600 + currentDateTime.getMinutes() * 60 + currentDateTime.getSeconds();

        for (let bellNum in this._config.bells[currentWeekday])
        {
            if (this._config.lessons[currentWeekday][bellNum] === "-")
                continue;

            const typeOfBell = typeof this._config.bells[currentWeekday][bellNum];

            if (typeOfBell === "string")
            {
                const bellStartTime = this._getSecondsFromTimeString(this._config.bells[currentWeekday][bellNum].substr(0, 5));

                if (currentTime < bellStartTime)
                {
                    printw(`Начало ${bellNum} занятия через ${this._getTimeStringFromSeconds(bellStartTime - currentTime)}\n`);
                    return;
                }

                const bellEndTime = this._getSecondsFromTimeString(this._config.bells[currentWeekday][bellNum].substr(6));

                if (currentTime < bellEndTime)
                {
                    printw(`Конец ${bellNum} занятия через ${this._getTimeStringFromSeconds(bellEndTime - currentTime)}\n`);
                    return;
                }
            }
            else if (typeOfBell === "object")
            {
                const bellStartTime = this._getSecondsFromTimeString(this._config.bells[currentWeekday][bellNum]["1"].substr(0, 5));

                if (currentTime < bellStartTime)
                {
                    printw(`Начало ${bellNum} занятия через ${this._getTimeStringFromSeconds(bellStartTime - currentTime)}\n`);
                    return;
                }

                const bellEndTime = this._getSecondsFromTimeString(this._config.bells[currentWeekday][bellNum]["2"].substr(6));

                if (currentTime < bellEndTime)
                {
                    printw(`Конец ${bellNum} занятия через ${this._getTimeStringFromSeconds(bellEndTime - currentTime)}\n`);

                    const firstHalfEndTime = this._getSecondsFromTimeString(this._config.bells[currentWeekday][bellNum]["1"].substr(6));

                    if (currentTime < firstHalfEndTime)
                    {
                        printw(`Конец 1 половины через ${this._getTimeStringFromSeconds(firstHalfEndTime - currentTime)}\n`);
                        return;
                    }

                    const secondHalfStartTime = this._getSecondsFromTimeString(this._config.bells[currentWeekday][bellNum]["2"].substr(0, 5));

                    if (currentTime < secondHalfStartTime)
                    {
                        printw(`Начало 2 половины через ${this._getTimeStringFromSeconds(secondHalfStartTime - currentTime)}\n`);
                        return;
                    }

                    return;
                }
            }
        }

        printw("Пары закончились\n");
    }

    /**
     * Converts a time string in "hh:mm:ss" format to seconds.
     * This method is used exclusively by the _time() method.
     *
     * @param {string} timeString - A string representing the time in "hh:mm:ss" format.
     * @returns {number} - The number of seconds.
     */
    _getSecondsFromTimeString(timeString)
    {
        const [hh = 0, mm = 0, ss = 0] = timeString.split(":").map(part => parseInt(part, 10) || 0);
        return ss + mm * 60 + hh * 3600;
    }

    /**
     * Converts seconds to a time string in "hh:mm:ss" format.
     * This method is used exclusively by the _time() method.
     *
     * @param {number} seconds - The number of seconds to convert.
     * @returns {string} - A string representing the time in "hh:mm:ss" format.
     */
    _getTimeStringFromSeconds(seconds)
    {
        const hh = Math.floor(seconds / 3600).toString().padStart(2, "0");
        const mm = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const ss = (seconds % 60).toString().padStart(2, "0");
        return `${hh}:${mm}:${ss}`;
    }
}
