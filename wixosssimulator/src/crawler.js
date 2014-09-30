﻿$(function () {
    var connection = $.hubConnection('/signalr', { useDefaultPath: false }), // 本番環境では '/wixosssimulator/signalr' なんだけど……
        crawler = connection.createHubProxy("crawler"),

        vm = {

            //self: this,
            started: ko.observable(false),

            userId: ko.observable(""),
            password: ko.observable(""),

            progressPrimary: ko.observable(0),
            progressPrimaryMessage: ko.observable(""),
            progressSecondary: ko.observable(0),
            progressSecondaryMessage: ko.observable(""),

            domain: ko.observable("Unknown"),
            domainAttribute: ko.observableArray([]),

            crawlingTable: ko.observableArray([]),
            isLoadCrawlingTable: ko.observable(false),
            loadCrawlingTable: function () {
                vm.enableToUpdate(false);
                vm.crawlingTable.removeAll();

                vm.isLoadCrawlingTable(true);
                crawler.invoke("SearchAllDomainId", vm.userId(), vm.password(), vm.domain());
            },


            //isSearch: ko.observable(false),
            //startSearching: function () {
            //    vm.isSearch(true);

            //    vm.isLoadCrawlingTable(true);
            //    var a = ko.toJSON(vm.crawlingTable());
            //    //crawler.invoke("GetCrawlingTable", vm.userId(), vm.password(), vm.domain());
            //    crawler.invoke("SearchAllDomainId", vm.domain(), ko.toJSON(vm.crawlingTable()));
            //    //crawler.invoke("UpdateCrawlingTable", vm.userId(), vm.password(), vm.domain(), ko.toJSON(vm.crawlingTable()));
            //    //vm.isSearch(false);
            //    //crawler.invoke("SearchAllDomainId2", vm.domain(), a);
            //},

            enableToUpdate: ko.observable(false),
            startUpdating: function () {
                crawler.invoke("UpdateCrawlingTable", vm.userId(), vm.password(), vm.domain(), ko.toJSON(vm.crawlingTable()));
                //for (var i = 0; i < vm.crawlingTable().length; i++) {
                //    var sqlJsonData = ko.toJSON(vm.crawlingTable()[i]);
                //    crawler.invoke("UpdateSql", vm.userId(), vm.password(), vm.domain(), sqlJsonData);
                //}

            }

        };

    function CrawlingData(data) {
        var self = this;
        self.domainId = ko.observable(data.domainId);
        self.url = ko.observable(data.url);
        self.lastUpdated = ko.observable(data.lastUpdated);
        self.lastConfirmed = ko.observable(data.lastConfirmed);
        self.deleted = ko.observable(data.deleted);
        self.bgColor = ko.computed(function () {
            if (self.deleted()) { return "#F5F5F5"; }

            if (vm.enableToUpdate()) {
                if (self.lastUpdated()) { return "#FFFFE0"; }
                return "#FFEBCD";
            }

            if (self.lastUpdated() == self.lastConfirmed()) {
                return "#F0FFF0";
            }
            return "#F0FFFF";
        });
    }

    ko.applyBindings(vm);

    crawler.on("SetDomainAttribute", function (domain) {
        vm.domainAttribute.push(domain);
    });

    crawler.on("SetCrawlingTable", function (crawlingTable) {
        vm.crawlingTable($.map(JSON.parse(crawlingTable), function (data) {
            return new CrawlingData(data);
        }));
        //vm.crawlingTable.push(new CrawlingData({}));
        vm.isLoadCrawlingTable(false);
        vm.enableToUpdate(false);
    });
    crawler.on("EndSearching", function (domain) {
        vm.enableToUpdate(true);
    });

    crawler.on("SetProgressPrimary", function (value, message) {
        vm.progressPrimary(value);
        vm.progressPrimaryMessage(message);
    });
    crawler.on("SetProgressSecondary", function (value, message) {
        vm.progressSecondary(value);
        vm.progressSecondaryMessage(message);
    });



    connection.start().done(function () {
        crawler.invoke("GetDomainList");
        vm.started(true);
    });
});
