{ sources ? import ./nix/sources.nix }:

let
  nixpkgs = sources.nixpkgs;
  nixjs-overlay = import sources.nixjs {
    inherit nixpkgs;
    versions = { nodejs = "9.10.1"; };
  };
  pkgs = import nixpkgs { overlays = [ nixjs-overlay ]; };

in with pkgs; mkShell { buildInputs = [ nodejs ]; }
