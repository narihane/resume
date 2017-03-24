var app = angular.module('app', ['ngAnimate', 'ngTouch', 'ui.grid']);
 
app.controller('MainCtrl', ['$scope', '$http', 'uiGridConstants', function ($scope, $http, uiGridConstants) {
  var today = new Date();
  var nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
 
  $scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
    if( col.filters[0].term ){
      return 'header-filtered';
    } else {
      return '';
    }
  };
 
  $scope.gridOptions = {
    enableFiltering: true,
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    },
    columnDefs: [
      // default
      { field: 'firstname', headerCellClass: $scope.highlightFilteredHeader },
      { field: 'lastname', headerCellClass: $scope.highlightFilteredHeader },
      // pre-populated search field
      { field: 'position', filter: {
          term: '1',
          type: uiGridConstants.filter.SELECT,
          selectOptions: [ { value: '1', label: 'IT' }, { value: '2', label: 'Sales' }, { value: '3', label: 'Manager'}, { value: '4', label: 'HR'} ]
        },
        cellFilter: 'mapGender', headerCellClass: $scope.highlightFilteredHeader },
      // no filter input
      { field: 'resume', enableFiltering: false, filter: {
        noTerm: true,
        condition: function(searchTerm, cellValue) {
          return cellValue.match(/a/);
        }
      }},
      // specifies one of the built-in conditions
      // and a placeholder for the input
      {
        field: 'email',
        filter: {
          condition: uiGridConstants.filter.ENDS_WITH,
          placeholder: 'ends with'
        }, headerCellClass: $scope.highlightFilteredHeader
      }
    
    ]
  };
 
  $http.get('/data/data.json')
    .success(function(data) {
      $scope.gridOptions.data = data;
 
      data.forEach( function addDates( row, index ){
        row.mixedDate = new Date();
        row.mixedDate.setDate(today.getDate() + ( index % 14 ) );
        row.gender = row.gender==='male' ? '1' : '2';
      });
    });
 
  $scope.toggleFiltering = function(){
    $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
    $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
  };
}])
.filter('mapGender', function() {
  var genderHash = {
    1: 'male',
    2: 'female'
  };
 
  return function(input) {
    if (!input){
      return '';
    } else {
      return genderHash[input];
    }
  };
});