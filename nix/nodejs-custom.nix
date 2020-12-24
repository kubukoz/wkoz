{ pkgs, version, sha256 }:

with import pkgs { };
callPackage (pkgs + "/pkgs/development/web/nodejs/nodejs.nix") {
  inherit openssl icu;
  python = python2;
} { inherit version sha256; }

