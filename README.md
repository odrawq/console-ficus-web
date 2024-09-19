# Console Ficus Web
![](images/console-ficus-web-icon.png)

Переписанный с нуля [Console Ficus](https://github.com/odrawq/console-ficus) для возможности пользоваться программой не устанавливая её прямо на устройство. Вместо Python, на котором полностью написан Console Ficus, для разработки Console Ficus Web был выбран JavaScript для более стабильной и быстрой работы в браузере. Функциональность и возможности в Console Ficus Web были более или менее реализованы точно так же, как и в Console Ficus, но были модифицированы некоторые некорректно работающие алгоритмы, а так же добавлены новые. Console Ficus Web, в отличие от Console Ficus, который нацелен на использование одним человеком, нацелен на использование группой лиц. Разместить, модифицировать под себя и использовать этот проект можно на любом удобном вам сервере. Конфигурация, как всегда, изначально написана для студентов группы 21П2-25 Кузнецкого колледжа электронных технологий.

## Что нового
- Тип текущей недели теперь вычисляется от начала учебного года, а не от начала нового года, что более корректно;
- Более гибкая настройка расписания звонков: теперь оно настраивается индивидуально для каждого дня, вместо шаблонов для будней и субботы. День теперь может содержать как пары так и уроки, поэтому вместо пар теперь используются занятия, поэтому школьники тоже могут пользоваться Console Ficus Web!  Программа теперь охватывает больший круг применения;
- Группировка расписаний по дням: если в расписании занятий или звонков есть дни с полностью одинаковым расписанием, они объединяются в одну группу для более компактного и удобного вывода;
- Выполнение команд из "autoexec" теперь происходит до вывода приглашения к вводу и отделяется от него пустой строкой;
- Удалены команды "e" и "exit" за их ненадобностью.

## Лицензия
Этот проект лицензирован по лицензии GNU General Public License v3.0 (GPL-3.0) - подробности в файле [LICENSE](LICENSE).
