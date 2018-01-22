var app = angular.module('myApp', ['ui.bootstrap']);

app.controller('MyCtrl', function($scope, $window, $http, $uibModal) {
    var vm = this;

    vm.searchText = "";
    vm.svi_proizvodi = [];
    vm.proizvodi = [];

    vm.username = '';

    vm.listaKategorija = [];
    vm.kategorijeProizvoda = {};
    vm.korpa = [];
	
	vm.ulogovan = false;
	vm.admin = false;

    vm.kategorija = null;
    vm.proizvod = null;
	
	vm.listaOcena = [1,2,3,4,5]; 
	vm.ocena = null; 
	
	vm.cenaOd; 
	vm.cenaDo; 
	
	vm.narucenaKolicina; 
	
	vm.users = [{username: "Marko", password: 123},
				{username: "Milos", password: 456},
				{username: "admin", password: "admin"}];    //F
	vm.user = null;  //F
	
	 vm.logout = function(){
        vm.user = null;
		vm.ulogovan = false;
		vm.admin = false;
    };
	
	vm.korpa = [];
	vm.suma;
	
	
    vm.alerts = $scope.alerts = [
    ];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    vm.currentPage = 1;
    vm.itemsPerPage = 18;
    vm.totalItems = 10;
    vm.maxSize = 5;

    vm.login = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'myModalContent.html',
        controller: function($uibModalInstance, parent){
            var $ctrl = this;

            $ctrl.stanje = 'Login';

            $ctrl.username = parent.username;

            $ctrl.register = function(){
				console.log("POVEZAN SAM!!!");
				if($ctrl.username != '' && $ctrl.password == $ctrl.confirmPassword){
					parent.alerts.push({type: "success", msg:"Uspešno ste se registrovali!"})
					parent.users.push({username: $ctrl.username, password: $ctrl.password});
					vm.ulogovan= true;
					if(parent.user.username == "admin" && parent.user.password == "admin"){
							vm.admin ==	true;
					}else{
							vm.admin == false;
							console.log("NISAM ADMIN!");
					}
					$uibModalInstance.dismiss('cancel');
				}else{
					parent.alerts.push({type: "danger", msg:"Neuspešno ste se registrovali!"})
					vm.ulogovan = false;
					vm.admin = false;
					$uibModalInstance.dismiss('cancel');
				}
            }

            $ctrl.cancel = function () {
              $uibModalInstance.dismiss('cancel');
            };
			

			$ctrl.login = function(){
				console.log("POVEZAN SAM!!!");
				console.log(parent.users);
				for(var i in parent.users){
					if(parent.users[i].username == $ctrl.username && parent.users[i].password == $ctrl.password){

						console.log("Prošlo je logovanje!");
						parent.alerts.push({type: "success", msg:"Uspešno ste se ulogovali!"});
						$uibModalInstance.dismiss('cancel');
						vm.ulogovan = true;
						parent.user = {username: $ctrl.username, password: $ctrl.password};
						console.log(parent.user);
						if($ctrl.username == "admin" && $ctrl.password == "admin"){
							vm.admin = true;
						}
						console.log(vm.admin);
						break;
					}else{
						console.log("Neuspešno logovanje!");
						parent.alerts.push({type: "danger", msg:"Neuspešno logovanje!"});
						vm.ulogovan = false;
						$uibModalInstance.dismiss('cancel');
						
					}
					
				}
				console.log(vm.admin);
				
				
			}
			
        },
        controllerAs: '$ctrl',
        resolve: {
          parent: function () {
            return vm;
          }
        }
      });

      modalInstance.result.then(function (username) {
        console.log(username);
      }, function () {
        console.log('modal-component dismissed at: ' + new Date());
      });
    };

    vm.home = function(){
      vm.kategorija = null;
      vm.proizvod = null;
      vm.proizvodi = vm.svi_proizvodi;
      vm.totalItems = vm.proizvodi.length;
    }
    vm.filterKategorije = function(kategorija){
      vm.kategorija = kategorija;
      vm.proizvod = null;
      vm.proizvodi = vm.kategorijeProizvoda[kategorija];
      vm.totalItems = vm.proizvodi.length;
    }
	
	vm.filterOcene = function(ocena){
		vm.ocena = ocena;
		vm.proizvod = null;
		vm.proizvodi = [];
		for(var i in vm.svi_proizvodi){
			if(vm.svi_proizvodi[i].ocena === ocena){
				vm.proizvodi.push(vm.svi_proizvodi[i]);
				
			}
			
		}
		vm.totalItems = vm.proizvodi.length;
		
	}
	
	vm.filterPoCeni = function(){
		vm.proizvod = null;
		vm.proizvodi = [];
		for(var i in vm.svi_proizvodi){
			if(vm.svi_proizvodi[i].cena > vm.cenaOd && vm.svi_proizvodi[i].cena < vm.cenaDo){
				vm.proizvodi.push(vm.svi_proizvodi[i]);	
			}
		}
	}
	
	vm.filter = function(el){
	   if(el == 'omiljeni'){
        var lista = [];
        for(var i in vm.svi_proizvodi){
          if(vm.svi_proizvodi[i].favorit == true){
            lista.push(vm.svi_proizvodi[i]);
          }
        }
        vm.totalItems = lista.length;
        vm.proizvodi = lista;
		}
	}
	
	
	vm.set_favorit = function(el){
      el.favorit = !el.favorit;
	  
	  if(vm.user !=null){
		if(el.favorit == true){
			$scope.alerts.push({ type: 'success', msg: 'Proizvod prebacen u grupu omiljenih' } )
		}else {
			$scope.alerts.push({ type: 'danger', msg: 'Proizvod vise nije omiljen' } )
		}
	  }else{
		  $scope.alerts.push({type: "danger", msg:"Niste ulogovani, nemoguće je oceniti proizvod!"});
	  }
	}
	
	vm.create = false;
	
	vm.dodajProizvod = function(){
	console.log("TU SAM!!!");
		var modalInstance = $uibModal.open({
			animation: false,
			templateUrl: 'dodajProizvod.html',
			controller: function($uibModalInstance, svi){
				var $ctrl = this;
				$ctrl.save = function(){
					var objProizvod = {
						naziv: $ctrl.naziv,
						kategorija: $ctrl.kategorija,
						opis: $ctrl.opis,
						ocena: $ctrl.ocena,
						kolicina: $ctrl.kolicina,
						proizvodjac: $ctrl.proizvodjac,
						cena: $ctrl.cena
					}
					console.log(objProizvod);
					console.log(svi);
					svi.push(objProizvod);
					$uibModalInstance.close($ctrl.naziv);
		
					
				}
				
			}
			,
				controllerAs: '$ctrl',
				resolve: {
				svi: function () {
					return vm.svi_proizvodi;
				}
				}
	
		});
		
		vm.proizvodi = vm.svi_proizvodi;
	}	
	
	vm.sortOpadajuce = function(){
		/*U izradi!*/
		
	}
	
	vm.sortRastuce = function(){
		/*U izradi!*/
		
	}
	
	
	vm.editProizvod = function(el){
			console.log("POVEZAN SAM!!!");
			vm.admin ==	true;
			var modalInstance = $uibModal.open({
				animation: false,
				templateUrl: 'editProizvod.html',
				controller: function($uibModalInstance, product){
					var $ctrl = this;
		
					$ctrl.naziv = product.naziv;
					$ctrl.kategorija = product.kategorija;
					$ctrl.opis = product.opis;
					$ctrl.ocena = product.ocena;
					$ctrl.kolicina = product.kolicina;
					$ctrl.proizvodjac = product.proizvodjac;
					$ctrl.cena = product.cena;
					
					$ctrl.save = function(){
					product.naziv = $ctrl.naziv;
					product.kategorija = $ctrl.kategorija;
					product.opis = $ctrl.opis ;
					product.ocena = $ctrl.ocena;
					product.kolicina = $ctrl.kolicina;
					product.proizvodjac = $ctrl.proizvodjac;
					product.cena = $ctrl.cena;
		
					$uibModalInstance.close($ctrl.naziv);
		
					}
		
					$ctrl.cancel = function () {
					$uibModalInstance.dismiss('cancel');
					};
				},
				controllerAs: '$ctrl',
				resolve: {
				product: function () {
					return el;
				}
				}
			});
		
			modalInstance.result.then(function (naziv) {
				el.naziv = naziv;
			
				
			}, function () {
				console.log('modal-component dismissed at: ' + new Date());
			});
		}
			

	  vm.saveProizvod = function(){
      vm.inEdit = false;

    }

	  
	vm.upozorenje = function(){
		if(vm.proizvod.kolicina < vm.narucenaKolicina){
			$scope.alerts.push({type:"danger",msg:"Prekoračena je količina!"});
		}else if(vm.user !=null){
			$scope.alerts.push({type:"success",msg:"Uspešno ste kupili proizvod!"});
			
			vm.kupi(vm.proizvod);
			vm.proizvod.kolicina -= vm.narucenaKolicina;
			
			var suma = 0;
			for(var i in vm.korpa){
				suma += vm.korpa[i].proizvod.cena * vm.korpa[i].kolicina;
			}
			
			vm.suma = suma;

		}else{
			$scope.alerts.push({type: "danger", msg:"Niste ulogovani, nemoguće je kupiti proizvod!"});
			
		}
		
		
	}
	
    vm.selektujProizvod = function(el){
      vm.kategorija = el.kategorija;
      vm.proizvod = el;
    }

    vm.init = function(){
      var req = {
          method: "GET",
          url: "proizvodi.json"
      }
      $http(req).then(
          function(resp){
            console.log(resp);
            var lista = [];
            vm.svi_proizvodi = resp.data;
            vm.kategorijeProizvoda = {};
            vm.listaKategorija = [];
            for(var i in vm.svi_proizvodi){
              var proizvod = vm.svi_proizvodi[i];
			  proizvod.favorit = false;
              if(!(proizvod.kategorija in vm.kategorijeProizvoda)){
                vm.listaKategorija.push(proizvod.kategorija);
                vm.kategorijeProizvoda[proizvod.kategorija] = [proizvod];
              }else{
                vm.kategorijeProizvoda[proizvod.kategorija].push(proizvod);
              }
              if(proizvod.naziv.toLowerCase().indexOf(vm.searchText.toLowerCase())!=-1){
                lista.push(proizvod);
              }
            }
            vm.totalItems = lista.length;
            vm.proizvodi = lista;
          }, function(resp){
              vm.message = 'error';
          });
    };

    vm.kupi = function(el){
      vm.korpa.push({proizvod: el, kolicina: vm.narucenaKolicina});
      $scope.alerts.push({ type: 'success', msg: 'Proizvod prebačen u korpu' } )
    };

    vm.init();


});
