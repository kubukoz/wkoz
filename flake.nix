{

  nixConfig.extra-substituters = "https://kubukoz-wkoz.cachix.org";
  nixConfig.extra-trusted-public-keys = "kubukoz-wkoz.cachix.org-1:TIIMNaXquQ/yL3iqfev20/JiqZCIORB7gvGDIWisPjU=";

  outputs = { ... }: {
    devShells.aarch64-darwin.default = import ./shell.nix { localSystem = "x86_64-darwin"; };
  };
}
