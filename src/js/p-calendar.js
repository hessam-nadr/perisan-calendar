'use strict';
var TEMPLATE = {

    datepciker: "<div class='{{css.calendarPlotArea}}' >" + //
    "<div class='{{css.navigator}}' ></div>" +//
    " <div class='{{css.dayView}}' ></div>" + //
    "</div>",

    navigator: "<div class='{{css.calendarHeader}}' >" + //
    "<div class='btn-group btn-group-navigator' role='group' >" +
    "<div class='btn {{css.btnNext}}'><span class='glyphicon glyphicon-chevron-left'></span></div>" +
    "<div class='btn {{css.btnPrev}}'><span class='glyphicon glyphicon-chevron-right'></span></div>" +
    "</div>" +
    "<div class='month-title-ja'></div>" + //
    "<div class='month-title-ge'></div>" + //
    "</div>",


    monthGrid: "<div class='{{css.main}}' >" + //
    "<div class='{{css.header}}' >" + //
    "<div class='{{css.headerTitle}}' ></div>" + //
    "<div class='{{css.headerRow}}' ></div>" + //
    "</div>" + //
    "<table cellspacing='0' class='{{css.daysTable}}'  ><tbody><tr><td /><td/><td/><td/><td/><td/><td/></tr><tr><td/><td/><td/><td/><td/><td/><td/></tr><tr><td/><td/><td/><td/><td/><td/><td/></tr><tr><td/><td/><td/><td/><td/><td/><td/></tr><tr><td/><td/><td/><td/><td/><td/><td/></tr><tr><td/><td/><td/><td/><td/><td/><td/></tr></tbody></table>" + //
    "</div>"
};
var ClassMonthGrid = {
    state: {
        year: null,
        month: null,
        date: null,
        firstWeekDayOfMonth: null,
        daysCount: null
    },

    persianDigit: true,

    _formatDigit: function (digit) {
        if (this.persianDigit) {
            return digit.toString().toPersianDigit();
        }
        else {
            return digit;
        }
    },

    events: {
        init: function () {
        },
        render: function () {
            this.state.month = this.month;
            this.state.year = this.year;
        },
        reRender: function () {
            this._markToday();
        },
        selectDay: function (x) {
        }
    },

    _markToday: function () {
        var self = this;
        var todate = new persianDate();
        $(self.element).removeClass(self.cssClass.today);
        $.each(self.daysList, function (index, value) {
            var htmlItemDay = $(this).data().day;
            var htmlItemMonth = $(this).data().month;
            var htmlItemYear = $(this).data().year;
            if (htmlItemDay == todate.date() && htmlItemMonth == todate.month() && htmlItemYear == todate.year()) {
                $(this).addClass(self.cssClass.today);
                $(self.element).addClass(self.cssClass.today);
            }
        });
        return this;
    },

    _updateState: function () {
        var self = this;
        var t = new persianDate();
        self.daysCount = t.daysInMonth(self.state.year, self.state.month);
        self.firstWeekDayOfMonth = t.getFirstWeekDayOfMonth(self.state.year, self.state.month);
        return this;
    },

    selectDate: function (unixDate) {
        var self = this, reRenderFlag;
        var sDate = new persianDate(unixDate);
        reRenderFlag = !(self.state.year == sDate.year() && self.state.month == sDate.month());
        self.state.year = sDate.year();
        self.state.month = sDate.month();
        self.state.date = sDate.date();
        if (reRenderFlag) {
            self.view.renderDays(self);
        }
        self.markSelectedDate(unixDate);
        return this;
    },

    markSelectedDate: function (unixDate) {
        var self = this;
        $.each(self.daysList, function (index, value) {
            var viewItemUnix = parseInt($(value).attr("unixDate"));
            if (self.isSameDay(viewItemUnix, unixDate)) {
                $(this).addClass(self.cssClass.selected);
            } else {
                $(this).removeClass(self.cssClass.selected);
            }
        });
    },

    updateAs: function (year, month) {
        var self = this;
        self.state.year = year;
        self.state.month = month;
        self.view.renderDays(self);
        return this;
    },

    goToNextMonth: function () {
        var self = this;
        if (self.state.month === 12) {
            self.state.month = 1;
            self.state.viewYear += 1;
        } else {
            self.state.month += 1;
        }
        self.updateAs(self.state.year, self.state.month);
        return false;
    },

    goToPrevMonth: function () {
    },

    goToYear: function (year) {
        this.updateAs(year, this.state.month);
    },

    applyStory: function () {
        //this.view.applyStory(this);
    }
};
var ClassCalendarState = {

    filterDate: {
        start: {
            year: 0,
            month: 0,
            date: 0,
            hour: 0,
            minute: 0,
            second: 0,
            unixDate: 0
        },
        end: {
            year: 0,
            month: 0,
            date: 0,
            hour: 0,
            minute: 0,
            second: 0,
            unixDate: 100
        }
    },

    view: {
        year: 0,
        month: 0,
        date: 0,
        hour: 0,
        minute: 0,
        second: 0,
        unixDate: 0
    },

    selected: {
        year: 0,
        month: 0,
        date: 0,
        hour: 0,
        minute: 0,
        second: 0,
        unixDate: 0
    },

    setFilterDate: function (key, startVal, endVal) {
        var self = this;
        if (!startVal) {
            startVal = -99999999999999;
        }
        var pd = new persianDate(startVal);
        self.filterDate.start.unixDate = startVal;
        self.filterDate.start.hour = pd.hour();
        self.filterDate.start.minute = pd.minute();
        self.filterDate.start.second = pd.second();
        self.filterDate.start.month = pd.month();
        self.filterDate.start.date = pd.date();
        self.filterDate.start.year = pd.year();

        if (!endVal) {
            endVal = 99999999999999
        }
        var pd = new persianDate(endVal);
        self.filterDate.end.unixDate = endVal;
        self.filterDate.end.hour = pd.hour();
        self.filterDate.end.minute = pd.minute();
        self.filterDate.end.second = pd.second();
        self.filterDate.end.month = pd.month();
        self.filterDate.end.date = pd.date();
        self.filterDate.end.year = pd.year();
    },

    _updateSelectedUnix: function () {
        this.selected.dateObj = new persianDate([this.selected.year,
            this.selected.month,
            this.selected.date,
            this.selected.hour,
            this.selected.minute,
            this.selected.second
        ])
        this.selected.unixDate = this.selected.dateObj.valueOf();
        return this;
    },

    setTime: function (key, value) {
        var self = this;
        switch (key) {
            case 'unix':
                self.selected.unixDate = value;
                var pd = new persianDate(value);
                self.selected.hour = pd.hour();
                self.selected.minute = pd.minute();
                self.selected.second = pd.second();
                self._updateSelectedUnix();
                break;
            case 'hour':
                this.selected.hour = value;
                self._updateSelectedUnix();
                break;
            case 'minute':
                this.selected.minute = value;
                self._updateSelectedUnix();
                break;
            case 'second':
                this.selected.second = value;
                self._updateSelectedUnix();
                break;
        }
        return this;
    },

    setSelected: function (key, value) {
        var self = this;
        switch (key) {
            case 'unix':
                self.selected.unixDate = value;
                var pd = new persianDate(value);
                self.selected.year = pd.year();
                self.selected.month = pd.month();
                self.selected.date = pd.date();
                self._updateSelectedUnix();
                break;
            case 'year':
                this.selected.year = value;
                self._updateSelectedUnix();
                break;
            case 'month':
                this.selected.month = value
                self._updateSelectedUnix();
                break;
            case 'date':
                this.selected.month = value
                self._updateSelectedUnix();
                break;
        }
        return this;
    },

    setSelectedDateTime:function (key, value) {
        var self = this;
        switch (key) {
            case 'unix':
                self.selected.unixDate = value;
                var pd = new persianDate(value);
                self.selected.year = pd.year();
                self.selected.month = pd.month();
                self.selected.date = pd.date();
                self.selected.hour = pd.hour();
                self.selected.minute = pd.minute();
                self.selected.second = pd.second();
                self._updateSelectedUnix();
                break;
            case 'year':
                this.selected.year = value;
                self._updateSelectedUnix();
                break;
            case 'month':
                this.selected.month = value
                self._updateSelectedUnix();
                break;
            case 'date':
                this.selected.month = value
                self._updateSelectedUnix();
                break;
        }
        return this;
    },

    syncViewWithelected: function () {
        this.view.year = this.selected.year;
        this.view.month = this.selected.month;
        this.view.date = this.selected.date;
        this.view.unixDate = this.selected.unixDate;
        return this;
    },

    _updateViewUnix: function () {
        this.view.dateObj = new persianDate([
            this.view.year,
            this.view.month,
            this.view.date,
            this.view.hour,
            this.view.minute,
            this.view.second
        ]);
        this.view.unixDate = this.view.dateObj.valueOf();
        return this;
    },

    setView: function (key, value) {
        var self = this;
        switch (key) {
            case 'unix':
                var pd = new persianDate(value);
                self.view.year = pd.year();
                self.view.month = pd.month();
                self.view.date = pd.date();
                self.view.unixDate = value;
                break;
            case 'year':
                this.view.year = value;
                this._updateViewUnix();
                break;
            case 'month':
                this.view.month = value;
                this._updateViewUnix();
                break;
            case 'date':
                this.view.month = value;
                this._updateViewUnix();
                break;
        }
        return this;
    }
};
var ClassDayPicker = {
    next: function () {
        var self = this;
        if (self.Calendar.state.view.month === 12) {
            self.Calendar.state.setView('month', 1);
            self.Calendar.state.setView('year', parseInt(self.Calendar.state.view.year) + 1);
        } else {
            self.Calendar.state.setView('month', parseInt(self.Calendar.state.view.month) + 1);
        }
        self._updateView();
        return this;
    },

    prev: function () {
        var self = this;
        if (self.Calendar.state.view.month === 1) {
            self.Calendar.state.setView('month', 12);
            self.Calendar.state.setView('year', parseInt(self.Calendar.state.view.year) - 1);
        } else {
            self.Calendar.state.setView('month', parseInt(self.Calendar.state.view.month) - 1);
        }
        self._updateView();
        return this;
    },

    updateView: function () {
        this._updateView();
        return this;
    },

    _updateView: function () {
        var self = this;
        self.mGrid.updateAs(self.Calendar.state.view.year, self.Calendar.state.view.month);
        var gdate = new window.Date(self.Calendar.state.view.dateObj.gDate);
        self._updateNavigator(self.Calendar.state.view.year, self.Calendar.state.view.month,gdate);
        this._updateSelectedDay(self.Calendar.state.selected.unixDate);
        return this;
    },

    selectDay: function () {
        var self = this;
        self.mGrid.updateAs(self.Calendar.state.selected.year, self.Calendar.state.selected.month);
        var gdate = new window.Date(self.Calendar.state.selected.dateObj.gDate);
        self._updateNavigator(self.Calendar.state.selected.year,
            self.Calendar.state.selected.month,selected.year,
            gdate);
        this._updateSelectedDay(self.Calendar.state.selected.unixDate);
        this._updateView();
        return this;
    },

    _updateNavigator: function (year, month,gdate) {
        var self = this;
        var pdateStr = this.titleFormatter(year, month);
        self.Calendar.updateNavigator(pdateStr,gdate);
        return this;
    },

    hide: function () {
        this.container.hide();
        return this;
    },

    show: function () {
        this.container.show();
        this._updateView();
        return this;
    },

    _updateSelectedDay: function (unix) {
        this.mGrid.markSelectedDate(unix);
        return this;
    },


    _render: function () {
        var self = this;
        this.mGrid = new MonthGrid({
            container: self.container,
            persianDigit: self.Calendar.persianDigit,
            month: self.Calendar.state.selected.month,
            year: self.Calendar.state.selected.year,
            minDate: self.Calendar.state.filterDate.start.unixDate,
            maxDate: self.Calendar.state.filterDate.end.unixDate,
            Calendar: self.Calendar
        });
        this.mGrid.attachEvent("selectDay", function (x) {
            self.Calendar.selectDate( x);
            self.onSelect(x);
            self.mGrid.selectDate(self.Calendar.state.selected.unixDate);
        });
        this._updateSelectedDay(self.Calendar.state.selected.unixDate);
    },

    init: function () {
        var self = this;
        this._render();
        var gdate = new window.Date(self.Calendar.state.selected.dateObj.gDate);
        this._updateNavigator(self.Calendar.state.selected.year,
            self.Calendar.state.selected.month,
            gdate);
        return this;
    }
};
var ClassNavigator = {

    cssClass: {
        calendarHeader: "calendar-header",
        btnNext: "btn-next",
        monthTitleJa: "month-title-ja",
        monthTitleGe: "month-title-ge",
        btnPrev: "btn-prev"
    },

    relation: "day",

    switchRelation: function (string) {
        this.relation = string;
        this.onSwitch(string);
        return this;
    },

    updateMonthTitle: function (val,gdate) {
        $(this.element).children('.' + this.cssClass.monthTitleJa).text(val);
        $(this.element).children('.' + this.cssClass.monthTitleGe).text(gdate);
        return this;
    },

    _next: function () {
        this.Calendar[this.relation + 'Picker'].next();
        this.onNext(this);
        return this;
    },

    _prev: function () {
        this.Calendar[this.relation + 'Picker'].prev();
        this.onPrev(this);
        return this;
    },

    _render: function () {
        var self = this;
        self.viewData = {
            css: self.cssClass
        };
        self.element = $.tmplMustache(TEMPLATE.navigator, self.viewData).appendTo(self.$container);
    },

    _attachEvents: function () {
        var self = this;
        self.element.children(".btn-group-navigator").children("." + self.cssClass.btnPrev).click(function () {
            self._prev();
            return false;
        });
        self.element.children(".btn-group-navigator").children("." + self.cssClass.btnNext).click(function () {
            self._next();
            return false;
        });
    },

    init: function () {
        var self = this;
        self._render();
        self._attachEvents();
        return this;
    }
};
var ViewsMonthGrid = {
    cssClass: {
        main: "month-grid-box",
        header: "header",
        headerTitle: "title",
        headerRow: "header-row",
        headerRowCell: "header-row-cell",
        daysTable: "table-days",
        currentMonth: "current-month",
        today: "today",
        selected: 'selected',
        disbaled: 'disabled'
    },
    views: {
        "default": {
            render: function (self) {
                self.viewData = {
                    css: self.cssClass
                };
                self.element = $.tmplMustache(TEMPLATE.monthGrid, self.viewData).appendTo(self.container);
                self.header = self.createElementByClass(self.cssClass.header);
                self.headerRow = self.createElementByClass(self.cssClass.headerRow);
                var weekDay;
                for (weekDay in self.weekRange) {
                    $("<div/>").text(self.weekRange[weekDay].name.fa).addClass(self.cssClass.headerRowCell).appendTo(self.headerRow)[0];
                }
                self.daysBox = self.createElementByClass(self.cssClass.daysTable);
                this.renderDays(self);
            },
            renderDays: function (self) {
                self._updateState();
                self.daysList = [];
                var addSpan = function (day, month, year, cssClass) {
                    var statements = self.Calendar.renderStatements(day, month, year,self);
                    var dayPartUnixTime = new persianDate([year, month, day]).valueOf();
                    var span = $(statements)
                        .addClass(cssClass)
                        .attr("unixDate", dayPartUnixTime)
                        .data({ day: day, month: month, year: year, unixDate: dayPartUnixTime})
                        .appendTo($(this))[0];
                    self.daysList.push(span);

                };
                var t = new persianDate();
                self.daysCount = t.daysInMonth(self.state.year, self.state.month);
                self.firstWeekDayOfMonth = t.getFirstWeekDayOfMonth(self.state.year, self.state.month);
                var currentMonthIndex = 1;
                var nextMonthIndex = 1;
                $(self.daysBox).find("td").each(function (index) {
                    $(this).empty();
                    if (self.firstWeekDayOfMonth > 1 && index + 1 < self.firstWeekDayOfMonth) {
                        if (self.state.month === 1) {
                            var prevMonth = 12;
                            var prevYear = parseInt(self.state.year) - 1;
                        } else {
                            var prevMonth = parseInt(self.state.month) - 1;
                            var prevYear = parseInt(self.state.year);
                        }
                        var prevMonthDaysCount = t.daysInMonth(prevYear, prevMonth);
                        var day = parseInt((prevMonthDaysCount - self.firstWeekDayOfMonth) + (index + 2));
                        addSpan.apply(this, [day, prevMonth, prevYear, "other-month"])
                    } else if (index + 2 === (currentMonthIndex + self.firstWeekDayOfMonth) && currentMonthIndex <= self.daysCount) {
                        var day = currentMonthIndex;
                        addSpan.apply(this, [day, parseInt(self.state.month), parseInt(self.state.year)])
                        currentMonthIndex++;
                    } else {

                        if (self.state.month === 12) {
                            var nextMonth = 1;
                            var nextYear = parseInt(self.state.year) + 1;
                        } else {
                            var nextMonth = parseInt(self.state.month) + 1;
                            var nextYear = self.state.year;
                        }
                        var day = nextMonthIndex;
                        addSpan.apply(this, [day, nextMonth, nextYear, "other-month"]);
                        nextMonthIndex += 1;
                    }
                    var thisUnix = $(this).children("span").data("unixDate");

                    if (self.Calendar.state._filetredDate) {
                        if (self.minDate && self.maxDate) {
                            if (thisUnix >= self.minDate && thisUnix <= self.maxDate) {
                                $(this).addClass(self.cssClass.disbaled);
                            } else {
                                $(this).removeClass(self.cssClass.disbaled);
                            }
                        } else if (self.minDate) {
                            if (thisUnix >= self.minDate) {
                                $(this).addClass(self.cssClass.disbaled);
                            }
                        } else if (self.maxDate) {
                            if (thisUnix <= self.maxDate) {
                                $(this).removeClass(self.cssClass.disbaled);
                            }
                        }
                    } else {
                        if (self.Calendar.checkDate(thisUnix)) {
                            $(this).removeClass(self.cssClass.disbaled);
                        } else {
                            $(this).addClass(self.cssClass.disbaled);
                        }
                    }
                });
                $(self.daysBox).find("td").not('.disabled').children("span").click(function () {
                    var $thisUnixDate = $(this).data("unixDate");
                    self.raiseEvent("selectDay", [$thisUnixDate]);
                    return false;
                });
                $(self.daysBox).find('td.disabled').children("span").click(function () {
                    return false;
                });
                self.raiseEvent("reRender");
            }
        }
    }
};

//ok
var ViewsCalendar = {

    cssClass: {
        calendarPlotArea: "calendar-plot-area",
        dayView: "calendar-day-view",
        navigator: "navigator",
    },

    container: {},

    views: {

        "default": {

            render: function (self) {
                var viewData = {
                    css: self.cssClass
                };

                self.element = {};
                self.statements = self.statement;
                self.renderStatements = self.renderStatements;

                self.element.main = $.tmplMustache(TEMPLATE.datepciker, viewData).appendTo(self.$container);

                if (!self._inlineView) {
                    self.element.main.hide();
                }
                else {
                    self.element.main.addClass('calendar-plot-area-inline-view');
                    self.element.main.show();
                }

                self.view.fixPosition(self);

                self.container.navigator = $(self.element.main).children('.' + self.cssClass.navigator);
                self.container.dayView = $(self.element.main).children('.' + self.cssClass.dayView);
                self.navigator = new Navigator($.extend(true, self.navigator, {Calendar: self}), self.container.navigator);

                self.dayPicker = new Daypicker($.extend(true, self.dayPicker, {Calendar: self}), self.container.dayView);
                self._pickers.day = self.dayPicker;

                self._syncWithImportData(self.state.unixDate);
                return this;
            },

            fixPosition: function (self) {
                if (!self._inlineView) {
                    var inputX = self.inputElem.offset().top;
                    var inputY = self.inputElem.offset().left;
                    if (self.position === "auto") {
                        var inputHeight = self.fullHeight(self.inputElem);
                        self.element.main.css({
                            top: (inputX + inputHeight) + 'px',
                            left: inputY + 'px'
                        });
                    } else {
                        self.element.main.css({
                            top: (inputX + self.position[0]) + 'px',
                            left: (inputY + self.position[1]) + 'px'
                        });
                    }
                }
                return this;
            }
        }
    }
};
var ClassBase = {

    init: function () {
        this.isInstance = true;
        this.raiseEvent('init');
    },

    publishInDic: function (objectList, methodName) {
        $.each(objectList, function (key, item) {
            item[methodName]();
        });
        return objectList;
    },

    callOfDict: function (objectList, key, methodName) {
    },

    isSameDay: function (unix1, unix2) {
        var d1 = new pDate(unix1);
        var d2 = new pDate(unix2);
        return d1 && d2 &&
            d1.year() === d2.year() &&
            d1.month() === d2.month() &&
            d1.date() === d2.date();
    },

    isValidGreguranDate: function (inputDate) {
        return inputDate &&
            new Date(inputDate) != "Invalid Date" &&
            new Date(inputDate) != "undefined";
    },

    validatePersianDateString: function (pasted) {
        var newDate = new Date(pasted);
        var inputArray = pasted.split("/");
        if (inputArray.length === 3) {
            var trueYear = inputArray[0].toString().length <= 4 && inputArray[0].toString().length >= 1;
            var trueMonth = inputArray[1].toString().length <= 2 && inputArray[1].toString().length >= 1;
            var trueDay = inputArray[2].toString().length <= 2 && inputArray[2].toString().length >= 1;
        }
        $.each(inputArray, function (index, key) {
            inputArray[index] = parseInt(key);
        });
        if (trueYear && trueMonth && trueDay && newDate !== "Invalid Date") {
            return inputArray;
        } else {
            return null;
        }
    },

    fullHeight: function (element) {
        return $(element).height() + parseInt($(element).css("padding-top")) + parseInt($(element).css("padding-bottom")) + parseInt($(element).css("borderTopWidth")) + parseInt($(element).css("borderBottomWidth"));
    },

    attachEvent: function (eventName, func) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        var f;
        for (f in this.events[eventName]) {
            if (this.events[eventName][f].toString() == func.toString()) {
                $.error("The function {0} was already added to event's chain.".format(func.toString));
            }
        }
        this.events[eventName].push(func)
        return this;
    },

    dettachEvent: function (eventName, func) {
        if (!this.events[eventName]) {
            $.error("The event's chain is empty.");
        }
        var f;
        for (f in this.events[eventName]) {
            if (this.events[eventName][f].toString() == func.toString()) {
                delete this.events[eventName][f];
            }
        }
        return this;
    },

    clearEvent: function (eventName) {
        this.events[eventName] = null;
        return this;
    },

    raiseEvent: function (eventName, args) {
        if (!eventName || !this.events) {
            return;
        }
        if (args) {
        } else {
            args = [];
        }
        var currentObject = this.events[eventName];
        if (!currentObject) {
            return;
        } else if (typeof currentObject === 'function') {
            currentObject.apply(this, args);
        } else {
            var e;
            for (e in currentObject) {
                currentObject[e].apply(this, args);
            }
        }
        return this;
    }
};
var ClassSprite = {

    defaultView: "default",

    events: {
        init: function () {
            this.render();
        },
        render: null
    },

    views: {
        'default': {
            render: function () {
            }
        }
    },

    element: {
        main: null// Root Element Of Sprite
    },

    createElementByClass: function (className) {
        return this.element.find('.' + className);
    },

    render: function (viewName) {
        if (!viewName) {
            viewName = 'default';
        }
        this.raiseEvent('render');
        this.view = this.views[viewName];
        return this.view.render(this);
    }
};

//ok
var ClassCompat = {
    compatConfig: function () {
        if (this.viewMode === false) {
            this.viewMode = 'day';
        }
        if (this.minDate | this.maxDate) {
            this.state.setFilterDate('unix', this.minDate, this.maxDate);
            this.state._filetredDate = true;
        } else {
            this.state._filetredDate = false;
        }
        return this;
    }
};

//ok
var ClassConfig = {

    persianDigit: true,

    viewMode: false,

    position: "auto",

    autoClose: false,

    format: false,

    observer: false,

    inputDelay: 800,

    formatter: function (unixDate) {
        var self = this;
        var pdate = new persianDate(unixDate);
        pdate.formatPersian = false;
        return pdate.format(self.format);
    },

    show: function () {
        this.view.fixPosition(this);
        this.element.main.show();
        this.onShow(this);
        this._viewed = true;
        return this;
    },

    hide: function () {
        if (this._viewed) {
            this.element.main.hide();
            this.onHide(this);
            this._viewed = false;
        }
        return this;
    },

    destroy: function () {
        this.inputElem.removeClass(self.cssClass);
        this.elmenet.main.remove();
    },

    onShow: function (self) {
    },

    onHide: function (self) {
    },

    onSelect: function (unixDate) {
        return this;
    },

    navigator: {

        onNext: function (navigator) {
            log("navigator next ");
        },

        onPrev: function (navigator) {
            log("navigator prev ");
        }
    },

    dayPicker: {
        titleFormat: 'YYYY MMMM',
        titleFormatter: function (year, month) {
            if (this.Calendar.persianDigit == false) {
                window.formatPersian = false;
            }
            var titleStr = new persianDate([year, month]).format(this.titleFormat);
            window.formatPersian = true;
            return titleStr
        },
        onSelect: function (selectedDayUnix) {
            //log("daypicker month day :" + selectedDayUnix);
        }

    },

    justSelectOnDate: true,

    minDate: false,

    maxDate: false,

    checkDate: function (unix) {
        return true;
    },

    checkMonth: function (month) {
        return true;
    },

    checkYear: function (year) {
        return true;
    },

    statement:[],

    renderStatements:function(){

    }

};
var ClassDateRange = {
    /**
     * @property monthRange
     */
    monthRange: {
        1: {
            name: {
                fa: "فروردین"
            },
            abbr: {
                fa: "فرو"
            }
        },
        2: {
            name: {
                fa: "اردیبهشت"
            },
            abbr: {
                fa: "ارد"
            }
        },
        3: {
            name: {
                fa: "خرداد"
            },
            abbr: {
                fa: "خرد"
            }
        },
        4: {
            name: {
                fa: "تیر"
            },
            abbr: {
                fa: "تیر"
            }
        },
        5: {
            name: {
                fa: "مرداد"
            },
            abbr: {
                fa: "مرد"
            }
        },
        6: {
            name: {
                fa: "شهریور"
            },
            abbr: {
                fa: "شهر"
            }
        },
        7: {
            name: {
                fa: "مهر"
            },
            abbr: {
                fa: "مهر"
            }
        },
        8: {
            name: {
                fa: "آبان"
            },
            abbr: {
                fa: "آبا"
            }

        },
        9: {
            name: {
                fa: "آذر"
            },
            abbr: {
                fa: "آذر"
            }
        },
        10: {
            name: {
                fa: "دی"
            },
            abbr: {
                fa: "دی"
            }
        },
        11: {
            name: {
                fa: "بهمن"
            },
            abbr: {
                fa: "بهم"
            }
        },
        12: {
            name: {
                fa: "اسفند"
            },
            abbr: {
                fa: "اسف"
            }
        }
    },


    /**
     * @property weekRange
     */
    weekRange: {
        0: {
            name: {
                fa: "شنبه"
            },
            abbr: {
                fa: "ش"
            }
        },
        1: {
            name: {
                fa: "یکشنبه"
            },
            abbr: {
                fa: "ی"
            }
        },
        2: {
            name: {
                fa: "دوشنبه"
            },
            abbr: {
                fa: "د"
            }
        },
        3: {
            name: {
                fa: "سه شنبه"
            },
            abbr: {
                fa: "س"
            }
        },
        4: {
            name: {
                fa: "چهار شنبه"
            },
            abbr: {
                fa: "چ"
            }
        },
        5: {
            name: {
                fa: "پنج شنبه"
            },
            abbr: {
                fa: "پ"
            }
        },
        6: {
            name: {
                fa: "جمعه"
            },
            abbr: {
                fa: "ج"
            }
        }
    },


    /**
     * @property persianDaysName
     */
    persianDaysName: ["اورمزد", "بهمن", "اوردیبهشت", "شهریور", "سپندارمذ", "خورداد", "امرداد", "دی به آذز", "آذز", "آبان", "خورشید", "ماه", "تیر", "گوش", "دی به مهر", "مهر", "سروش", "رشن", "فروردین", "بهرام", "رام", "باد", "دی به دین", "دین", "ارد", "اشتاد", "آسمان", "زامیاد", "مانتره سپند", "انارام", "زیادی"]
};

//ok
var ClassCalendar = {

    _pickers: {},

    _viewed: false,

    _inlineView: false,

    _getNextState: function (action) {
        var currentState = this.currentView;
        var nextState = this.currentView;
        if (action === 'next') {
            if (currentState === 'month' && this.dayPicker) {
                nextState = 'day';
            }
            if (currentState === 'year') {
                if (this.dayPicker) {
                    nextState = 'day';
                }
            }
        }
        else if (action === 'prev') {
            if (currentState === 'month' ) {
                nextState = 'year';
            }
        }
        return this._checkNextStateAvalibility(nextState);
    },

    _checkNextStateAvalibility: function (state) {
        if (!this._pickers[state]) {
            this.element.main.hide();
            return false;
            $.error(state + "Picker Set as {enabled:false} and dos not exist!! Set viewMode to Enabled view Check Configuration");
        }
        return state;
    },

    updateNavigator: function (switchStr,gdate) {
        this.navigator.updateMonthTitle(this._formatDigit(switchStr),this._formatDigitGeDate(gdate));
        return this;
    },

    _flagSelfManipulate: true,

    selectDate: function (unixDate) {
        var self = this;
        self.state.setSelected('unix', unixDate);
        this.state.syncViewWithelected();
        self._updateInputElement();
        self.onSelect(unixDate, this);
        if (self.autoClose) {
            self.element.main.hide();
        }
        return this;
    },

    _formatDigit: function (digit) {
        if (this.persianDigit && digit) {
            return digit.toString().toPersianDigit();
        }
        else {
            return digit;
        }
    },

    _formatDigitGeDate: function (gdate){
        var date = new window.Date(gdate);
        var month = ["January","February","March",
            "April","May","June","July","August",
            "September","October","November","December"];
        return ""+date.getFullYear()+" "+month[date.getMonth()];
    },

    _syncWithImportData: function (pasted) {
        if (pasted) {
            var self = this;
            if (jQuery.isNumeric(pasted)) {
                var newPersainDate = new persianDate(pasted);
                self.state.setSelected('unix', newPersainDate);
                self._updateInputElement();
            } else {
                var persianDateArray = self.validatePersianDateString(pasted);
                if (persianDateArray != null) {
                    delay(function () {

                        var newPersainDate = new persianDate(persianDateArray);
                        self.selectDate(newPersainDate.valueOf());
                    }, self.inputDelay)
                }
            }
        }
        return this;
    },

    _attachEvents: function () {
        var self = this;
        $(window).resize(function () {
            self.view.fixPosition(self);
        });
        if (self.observer) {
            /////////////////   Manipulate by Copy And paste
            self.inputElem.bind('paste', function (e) {
                delay(function () {
                    self._syncWithImportData(e.target.value);
                }, 60);
            });

            /////////////////   Manipulate by keyboard
            var ctrlDown = false;
            var ctrlKey = [17, 91], vKey = 86, cKey = 67;
            $(document).keydown(function (e) {
                if ($.inArray(e.keyCode, ctrlKey) > 0)
                    ctrlDown = true;
            }).keyup(function (e) {
                if ($.inArray(e.keyCode, ctrlKey) > 0)
                    ctrlDown = false;
            });
            self.inputElem.bind("keyup", function (e) {
                var $self = $(this);
                if (!self._flagSelfManipulate) {
                    var trueKey = false;
                    if (e.keyCode === 8 || e.keyCode < 105 && e.keyCode > 96 || e.keyCode < 58 && e.keyCode > 47 || (ctrlDown && (e.keyCode == vKey || $.inArray(e.keyCode, ctrlKey) > 0  ))) {
                        trueKey = true;
                    }
                    if (trueKey) {
                        self._syncWithImportData($self.val());
                    }
                }
            });
        }

        self.inputElem.focus(function () {
            self.show();
        });
        self.inputElem.click(function (e) {
            e.stopPropagation();
            return false;
        });
        self.inputElem.blur(function () {
            if (!$.browser.msie) {
                self.hide();
            }
        });
        $(document).not(".calendar-plot-area,.calendar-plot-area > *").click(function (e) {
            self.inputElem.blur();
            self.hide();

        });
        $(self.element.main).mousedown(function (e) {
            e.stopPropagation();
            return false;
        });
        return this;
    },

    _updateInputElement: function () {
        var self = this;
        self._flagSelfManipulate = true;
        // Update Display Field
        self.inputElem.val(self.formatter(self.state.selected.unixDate)).trigger('change');

        self._flagSelfManipulate = false;
        return self;
    },

    _defineOnInitState: function () {
        if ($(this.$container)[0].nodeName == 'INPUT') {
            var garegurianDate = new Date(this.inputElem.val()).valueOf();
            this.$container = $('body');
        }
        else {
            var garegurianDate = new Date($(this.$container).data('date')).valueOf();
            this._inlineView = true;
        }
        if (garegurianDate && garegurianDate != 'undefined') {
            this.state.unixDate = garegurianDate;
        }
        else {
            this.state.unixDate = new Date().valueOf();
        }
        this.state.setSelectedDateTime('unix', this.state.unixDate);
        this.state.setTime('unix', this.state.unixDate);
        this.state.setView('unix', this.state.unixDate);
        return this;
    },

    setDate: function (p) {
        var date = new persianDate(p);
        this.selectDateTime(date.valueOf())
        this.setTime();
        return this;
    },

    init: function () {
        var self = this;
        this.statement = self.statement;
        this.renderStatements = self.renderStatements;
        this.state = new State({Calendar: self});
        this.compatConfig();
        this._defineOnInitState();
        this._updateInputElement();
        this.view = this.views['default'];
        this.view.render(this);
        this.inputElem.data("Calendar", this);
        this.inputElem.addClass(self.cssClass);
        this._attachEvents();
        return this;
    }
};
var Daypicker = function (options, container) {
    return inherit(this, [ClassSprite, ClassDayPicker, options, {
        container: container
    }]);
};
var Navigator = function (options, container) {
    return inherit(this, [ClassSprite, ClassNavigator, options, {
        $container: container
    }]);
};

//ok
var Calendar = function (mainElem, options) {
    return inherit(this, [ClassSprite, ClassCompat, ClassCalendar, ViewsCalendar, ClassConfig, options, {
        $container: mainElem,
        inputElem: $(mainElem)
    }]);
};
var State = function (options) {
    return inherit(this, [ClassCalendarState, options]);
};
var MonthGrid = function (options) {
    // Change !!
    //this.pcal = options.parent.pcal;
    inherit(this, [ClassSprite, ViewsMonthGrid, ClassDateRange, ClassMonthGrid, options]);
    return this;
};

Object.keys = Object.keys || (function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty, hasDontEnumBug = !{
            toString: null
        }.propertyIsEnumerable("toString"), DontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'], DontEnumsLength = DontEnums.length;

        return function (o) {
            if (typeof o !== "object" && typeof o !== "function" || o === null)
                throw new TypeError("Object.keys called on a non-object");

            var result = [];
            for (var name in o) {
                if (hasOwnProperty.call(o, name))
                    result.push(name);
            }

            if (hasDontEnumBug) {
                for (var i = 0; i < DontEnumsLength; i++) {
                    if (hasOwnProperty.call(o, DontEnums[i]))
                        result.push(DontEnums[i]);
                }
            }
            return result;
        };
    })();

$.event.special.textchange = {
    setup: function (data, namespaces) {
        $.event.special.textchange.saveLastValue(this);
        $(this).bind('keyup.textchange', $.event.special.textchange.handler);
        $(this).bind('cut.textchange paste.textchange input.textchange', $.event.special.textchange.delayedHandler);
    },
    teardown: function (namespaces) {
        $(this).unbind('.textchange');
    },
    handler: function (event) {
        $.event.special.textchange.triggerIfChanged($(this));
    },
    delayedHandler: function (event) {
        var element = $(this);
        setTimeout(function () {
            $.event.special.textchange.triggerIfChanged(element);
        }, 25);
    },
    triggerIfChanged: function (element) {
        var current = element[0].contentEditable === 'true' ? element.html() : element.val();
        if (current !== element.data('lastValue')) {
            element.trigger('textchange', element.data('lastValue'));

            // element.data('lastValue', current);
        }
    },
    saveLastValue: function (element) {
        $(element).data('lastValue', element.contentEditable === 'true' ? $(element).html() : $(element).val());
    }
};
$.event.special.hastext = {

    setup: function (data, namespaces) {
        $(this).bind('textchange', $.event.special.hastext.handler);
    },

    teardown: function (namespaces) {
        $(this).unbind('textchange', $.event.special.hastext.handler);
    },

    handler: function (event, lastValue) {
        if ((lastValue === '') && lastValue !== $(this).val()) {
            $(this).trigger('hastext');
        }
    }
};
$.event.special.notext = {
    setup: function (data, namespaces) {
        $(this).bind('textchange', $.event.special.notext.handler);
    },

    teardown: function (namespaces) {
        $(this).unbind('textchange', $.event.special.notext.handler);
    },

    handler: function (event, lastValue) {
        if ($(this).val() === '' && $(this).val() !== lastValue) {
            $(this).trigger('notext');
        }
    }
};
var origValFn = $.fn.val;
$.fn.val = function () {
    var returnValue = origValFn.apply(this, arguments);
    if (arguments.length) {
        this.each(function () {
            $.event.special.textchange.triggerIfChanged($(this));
        });
    }
    return returnValue;
};
$.tmplMustache = function (input, dict) {
    // Micro Mustache Template engine
    String.prototype.format = function string_format(arrayInput) {
        function replacer(key) {
            var keyArr = key.slice(2, -2).split("."), firstKey = keyArr[0], SecondKey = keyArr[1];
            if (arrayInput[firstKey] instanceof Object) {
                return arrayInput[firstKey][SecondKey];
            } else {
                return arrayInput[firstKey];
            }
        }

        return this.replace(/{{\s*[\w\.]+\s*}}/g, replacer);
    };
    return $(input.format(dict));
};

String.prototype.toPersianDigit = function (a) {
    return this.replace(/\d+/g, function (digit) {
        var enDigitArr = [], peDigitArr = [];
        for (var i = 0; i < digit.length; i++) {
            enDigitArr.push(digit.charCodeAt(i));
        }
        for (var j = 0; j < enDigitArr.length; j++) {
            peDigitArr.push(String.fromCharCode(enDigitArr[j] + ((!!a && a == true) ? 1584 : 1728)));
        }
        return peDigitArr.join('');
    });
};
String.prototype.toEngilshDigit = function (a) {
    return this.replace(/\d+/g, function (digit) {
        var enDigitArr = [], peDigitArr = [];
        for (var i = 0; i < digit.length; i++) {
            enDigitArr.push(digit.charCodeAt(i));
        }
        for (var j = 0; j < enDigitArr.length; j++) {
            peDigitArr.push(String.fromCharCode(enDigitArr[j] - ((!!a && a == true) ? 1584 : 1728)));
        }
        return enDigitArr.join('');
    });
};

var delay = function (callback, ms) {
    clearTimeout(window.CalendarTimer);
    window.CalendarTimer = setTimeout(callback, ms);
};
var log = function (input) {
    //console.log(input);
};
var range = function (e) {
    var r = [];
    var i = 0;
    while (i <= e - 1) {
        r.push(i);
        i++;
    }
    return r;
};
var inherit = function (self, baseClasses) {
    var copyObject = function (o) {
        return $.extend(true, {}, o);
    };
    var args = [true, self, copyObject(ClassBase)];
    var events = [];
    for (var index in baseClasses) {
        var cls = copyObject(baseClasses[index]);
        if (!cls) {
            continue;
        }
        if (cls['events'] && Object.keys(cls['events']).length > 0) {
            events.push(cls['events']);
        }
        cls.events = {};
        args.push(cls);
    }
    $.extend.apply(self, args);
    for (var index in events) {
        var eventsObject = events[index];
        var eventKeys = Object.keys(eventsObject)
        for (var keyIndex in eventKeys) {
            var key = eventKeys[keyIndex]
            var val = eventsObject[key];
            if (key && val) {
                self.attachEvent(key, val);
            }
        }
    }
    self.init();
    return self;
};

jQuery.uaMatch = function (ua) {
    ua = ua.toLowerCase();

    var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
        /(webkit)[ \/]([\w.]+)/.exec(ua) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
        /(msie) ([\w.]+)/.exec(ua) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
        [];

    return {
        browser: match[ 1 ] || "",
        version: match[ 2 ] || "0"
    };
};
// cDon't clobber any existing jQuery.browser in case it's different
if (!jQuery.browser) {
    var matched = jQuery.uaMatch(window.navigator.userAgent);
    var browser = {};

    if (matched.browser) {
        browser[ matched.browser ] = true;
        browser.version = matched.version;
    }

    // Chrome is Webkit, but Webkit is also Safari.
    if (browser.chrome) {
        browser.webkit = true;
    } else if (browser.webkit) {
        browser.safari = true;
    }

    jQuery.browser = browser;
}


