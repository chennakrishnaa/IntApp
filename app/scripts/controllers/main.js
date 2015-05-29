'use strict';
//var localStorageModule = angular.module('LocalStorageModule',[]).value('prefix', 'myPre');;
angular.module('yoangularApp').controller('MainCtrl', ['$scope', 'localStorageService',
    function($scope, localStorageService) {
        //console.log("done");
        //console.log(localStorageService);
        //localStorageService.set("myvalu","33323");
        //console.log(localStorageService.get("myvalu"));
        $scope.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];
        $scope.borrower = {
            toDate: new Date().toJSON().slice(0, 10),
            interestMethod: 2,
            interestRate: 2,
            period: 12,
            amount:25000,

        };
        $scope.calculation = {};
        $scope.master = {};
        $scope.update = function(borrower) {
            //$scope.master = angular.copy(borrower);
            localStorageService.set(borrower.borrowerName, borrower);
        };
        $scope.reset = function() {
            console.log('reset');
            $scope.borrower = angular.copy($scope.master);
            $scope.duration = {};
        };
        $scope.isUnchanged = function(borrower) {
            return angular.equals(borrower, $scope.master);
        };
        $scope.print = function() {
            window.print();
        };
        $scope.calculate = function(borrower) {
            var simpleIntValue, totalIntValue, complexIntValue, noOfPeriods, intRate, intRatePerPeriod, totalMonths;
            //Calculate interest Rate
            intRate = borrower.interestRate * 12 / 100;
            //calculate duration
            $scope.duration = $scope.private.getDuration(borrower.fromDate, borrower.toDate);
            //calculate interest
            //12000 , 24% , 2 years
            if (borrower.interestMethod === 1) {
                simpleIntValue = (borrower.amount * intRate);
                totalIntValue = simpleIntValue * $scope.duration.years + ((simpleIntValue * $scope.duration.months) / 12) + ((simpleIntValue * $scope.duration.days) / (12 * 30));

            } else {
                /*
                fv = pv(1+r/n)n
                 */
                 /*
        years = 2, months = 10
        total months = 2*12 + 10 = 34
        period = 6
        effective no of periods = 34 - 34%6 = 30
        4 months have to calculate normal interest
    */
                totalMonths = $scope.duration.years * 12 + $scope.duration.months;
                noOfPeriods = (totalMonths - (totalMonths % borrower.period))/ (borrower.period);
                if (noOfPeriods && noOfPeriods > 0) {
                    intRatePerPeriod = (intRate * borrower.period) / 12;
                    //Complex interest rate
                    complexIntValue = (borrower.amount * Math.pow((1 + (intRatePerPeriod)), noOfPeriods)) - borrower.amount;
                    console.log(complexIntValue);
                    simpleIntValue = ((borrower.amount + complexIntValue )* intRate);
                    console.log(simpleIntValue);
                    //totalIntValue = simpleIntValue * $scope.duration.years + ((simpleIntValue * $scope.duration.months)/12) + (((simpleIntValue * $scope.duration.days)/12*30));
                    totalIntValue = complexIntValue + (simpleIntValue * (totalMonths % borrower.period / 12)) + ((simpleIntValue * $scope.duration.days) / (12 * 30));
                }
                else {
                    simpleIntValue = borrower.amount * intRate;
                    //totalIntValue = simpleIntValue * $scope.duration.years + ((simpleIntValue * $scope.duration.months)/12) + (((simpleIntValue * $scope.duration.days)/12*30));
                    console.log(simpleIntValue);
                    totalIntValue =  ((simpleIntValue * (totalMonths % borrower.period) / 12)) + ((simpleIntValue * $scope.duration.days) / (12 * 30));
                    console.log(totalIntValue);
                }
                
            }
            totalIntValue = parseFloat(totalIntValue.toFixed(2));
            $scope.duration.interest = totalIntValue;
        };
        $scope.private = {
            getDuration: function(fromDate, toDate) {
                var duration = {},
                    date1, date2, diff;
                    
                duration.message = {};
                date1 = +new Date(fromDate.substring(0, 4), fromDate.substring(5, 7) - 1, fromDate.substring(8, 10));
                date2 = +new Date(toDate.substring(0, 4), toDate.substring(5, 7) - 1, toDate.substring(8, 10));
                diff = (date2 - date1) / (24 * 60 * 60 * 1000);
                if (diff < 0) {
                    duration.message.code = 'E';
                    duration.message.description = 'to date should be greater than from date';
                    return duration;
                }
                /*
                duration.fromDate = {};
                duration.toDate = {};
                duration.fromDate.day = fromDate.substring(8, 10);
                duration.fromDate.month = fromDate.substring(5, 7) ;
                duration.fromDate.year = fromDate.substring(0, 4);
                duration.fromDate.isLeap = (duration.fromDate.year%100 === 0) ? (duration.fromDate.year%400 === 0) ? true: false :(duration.fromDate.year%4 === 0)?true:false;
                duration.toDate.day = toDate.substring(8, 10);
                duration.toDate.month = toDate.substring(5, 7) ;
                duration.toDate.year = toDate.substring(0, 4);
                duration.toDate.isLeap = (duration.toDate.year%100 === 0) ? (duration.toDate.year%400 === 0) ? true: false :(duration.toDate.year%4 === 0)?true:false;
                //*/
                //*
                duration.fromDate = this.splitDate(fromDate);
                duration.toDate = this.splitDate(toDate);
                //*/
                if (duration.toDate.day < duration.fromDate.day) {
                    duration.days = (parseInt(duration.toDate.day, 10) + 30) - duration.fromDate.day;
                    duration.toDate.month = duration.toDate.month - 1;
                } else {
                    duration.days = duration.toDate.day - duration.fromDate.day;
                }
                if (duration.toDate.month < duration.fromDate.month) {
                    duration.months = (parseInt(duration.toDate.month, 10) + 12) - duration.fromDate.month;
                    duration.toDate.year = duration.toDate.year - 1;
                } else {
                    duration.months = duration.toDate.month - duration.fromDate.month;
                }
                duration.months = duration.months < 0 ? 0 : duration.months;
                duration.years = duration.toDate.year - duration.fromDate.year;
                return duration;
            },
            splitDate: function(sDate) {
                return {
                    day: sDate.substring(8, 10),
                    month: sDate.substring(5, 7),
                    year: sDate.substring(0, 4),
                    isLeap: (this.year % 100 === 0) ? (this.year % 400 === 0) ? true : false : (this.year % 4 === 0) ? true : false
                };
            }
        };

        //$scope.reset();
    }
]);
