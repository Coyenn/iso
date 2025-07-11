{
  description = "Hexe";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/master";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShell = pkgs.mkShell {
        nativeBuildInputs = [pkgs.fish];
        buildInputs = with pkgs; [
          openssl
          nodePackages.prisma
          bun
        ];
        shellHook = with pkgs; ''
          export PRISMA_SCHEMA_ENGINE_BINARY="${prisma-engines}/bin/schema-engine"
          export PRISMA_QUERY_ENGINE_BINARY="${prisma-engines}/bin/query-engine"
          export PRISMA_QUERY_ENGINE_LIBRARY="${prisma-engines}/lib/libquery_engine.node"
          export PRISMA_FMT_BINARY="${prisma-engines}/bin/prisma-fmt"
        '';
      };
    });
}
