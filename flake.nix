{

  nixConfig.extra-substituters = "https://kubukoz-wkoz.cachix.org";
  nixConfig.extra-trusted-public-keys = "kubukoz-wkoz.cachix.org-1:TIIMNaXquQ/yL3iqfev20/JiqZCIORB7gvGDIWisPjU=";

  outputs = { nixpkgs, ... }:
    let pkgs = import nixpkgs { system = "aarch64-darwin"; }; in
    {
      devShells.aarch64-darwin.default = pkgs.mkShell { buildInputs = [ pkgs.yarn ]; };
    };
}
