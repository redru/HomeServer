(function() {

    var ContoController = function($http) {
        this.$http = $http;

        this.users = [];
        this.accounts = [];
        this.entries = [];

        this.dataEntryModel = {
            ID: '',
            USER_ID: '',
            ACCOUNT_ID: '',
            VALUE: '',
            CODE: '',
            CAUSAL: '',
            DATE: '',
            UPDATE: false,

            reset: function() {
                this.ID = '';
                this.USER_ID = '';
                this.ACCOUNT_ID = '';
                this.VALUE = '';
                this.CODE = '';
                this.CAUSAL = '';
                this.DATE = '';
                this.UPDATE = false;
            }
        }

        this.balance = {
            total: 0,
            active: 0,
            passive: 0,
            isActive: true,

            reset: function() {
                this.total = 0;
                this.active = 0;
                this.passive = 0;
                this.isActive = true;
            }
        };

        this.select = {
            selectedUser: {
                ID: '',
                USERNAME: ''
            },

            selectedAccount: {
                ID: '',
                DESCRIPTION: ''
            }
        };

        this.getUsers();
    };

    ContoController.prototype.getUsers = function() {
        this.$http.get('/bank/getUsers')
            .then((response) => {
                this.users = JSON.parse(response.data);
            });
    };

    ContoController.prototype.getAccounts = function() {
        this.accounts = [];
        this.entries = [];
        this.select.selectedAccount = '';
        this.balance.reset();

        if (!this.select.selectedUser)
            return;

        this.$http({
            url: '/bank/getAccounts',
            method: 'GET',
            params: { USER_ID: this.select.selectedUser.ID },

        }).then((response) => {
            var data = JSON.parse(response.data);
            this.accounts = data ? data : [];
        });
    };

    ContoController.prototype.getAccountEntries = function() {
        this.entries = [];
        this.balance.reset();

        if (!this.select.selectedUser || !this.select.selectedAccount)
            return;

        this.$http({
            url: '/bank/getEntries',
            method: 'GET',
            params: { USER_ID: this.select.selectedUser.ID, ACCOUNT_ID: this.select.selectedAccount.ID },

        }).then((response) => {
            this.entries = JSON.parse(response.data);
            this.processBalance();
        });
    };

    ContoController.prototype.addEntry = function() {
        var $http = this.$http;

        this.dataEntryModel.USER_ID = this.select.selectedUser.ID;
        this.dataEntryModel.ACCOUNT_ID = this.select.selectedAccount.ID;

        $http({
            method: 'POST',
            url: '/bank/addEntry',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(this.dataEntryModel)
        }).then((response) => {
            if (response.data) {
                this.entries = JSON.parse(response.data);
                this.processBalance();
                document.getElementById('addEntryForm').reset();
            } else if (response.data == 'EMPTY') {
                alert('Problemi durante l\'inserimento.');
            }
        });
    };

    ContoController.prototype.deleteEntry = function(id) {
        var $http = this.$http;
        var data = '{ "ENTRY_ID": "' + id + '", "USER_ID": "' + this.select.selectedUser.ID + '", "ACCOUNT_ID": "' + this.select.selectedAccount.ID + '" }';

        if (!confirm('Confermare eliminazione?')) {
            return;
        }

        $http({
            method: 'POST',
            url: '/bank/deleteEntry',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        }).then((response) => {
            if (response.data) {
                this.entries = JSON.parse(response.data);
                this.processBalance();
            } else if (response.data == 'EMPTY') {
                alert('Problemi durante la rimozione.');
            }
        });
    };

    ContoController.prototype.prepareDataEntryModelForUpdate = function(entry) {
        this.dataEntryModel.ID = entry.ID;
        this.dataEntryModel.USER_ID = entry.USER_ID;
        this.dataEntryModel.ACCOUNT_ID = entry.ACCOUNT_ID;
        this.dataEntryModel.VALUE = entry.VALUE
        this.dataEntryModel.CODE = entry.CODE;
        this.dataEntryModel.CAUSAL = entry.CAUSAL;
        this.dataEntryModel.DATE = new Date(entry.DATE);
        this.dataEntryModel.UPDATE = true;
    };

    ContoController.prototype.processBalance = function() {
        this.balance.reset();

        for (var idx in this.entries) {
            if (this.entries[idx].VALUE > 0)
                this.balance.active += this.entries[idx].VALUE;
            else
                this.balance.passive += this.entries[idx].VALUE;

            this.balance.total += this.entries[idx].VALUE;
        }

        this.balance.isActive = this.balance.total >= 0;
    };

    // AngularJS, controller Class initialization
    ContoController.$inject = [ '$http' ];
    app.controller('ContoController', ContoController);

})();