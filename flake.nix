{
  description = "Java base devShell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs = { self, nixpkgs }@inputs: 
  let
    system = "x86_64-linux";

    pkgs = nixpkgs.legacyPackages.${system};

    inherit (pkgs) lib;
  in {
    devShells.${system}.default = pkgs.mkShell {
      buildInputs = with pkgs; [ nodejs_22 ];
      nativeBuildInputs = with pkgs; [];
    };
  };
}
