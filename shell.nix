{ sources ? import ./nix/sources.nix }:

let
  pkgs = import sources.nixpkgs { };
  node9 = (import ./nix/nodejs-custom.nix {
    pkgs = sources.nixpkgs;
    version = "9.10.1";
    sha256 = "1widvxbc8sp8p8vp7q38b3zy0w1nx4iaqmp81s6bvaqs08h7wfy9";
  });
in pkgs.mkShell { buildInputs = [ node9 ]; }
