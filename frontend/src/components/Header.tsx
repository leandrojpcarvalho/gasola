import { Link } from "react-router-dom";
import type { Usuario } from "jogodaforca-shared";
import { Button } from "./Button";
import { Gamepad2, User } from "lucide-react";

interface HeaderProps {
    usuario: Usuario | null;
}

export function Header({ usuario }: HeaderProps) {

    return (
        <header className="top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
            <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Gamepad2 className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-display font-bold text-xl text-foreground">
                        Jogo da Forca
                    </span>
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {usuario ? (
                        <>
                            {/* User indicator - clickable */}
                            <Link to="/usuario" className="flex items-center gap-2 pl-3 border-l border-border hover:opacity-80 transition-opacity">
                                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
                                    <User className="w-4 h-4 text-accent" />
                                </div>
                                <span className="text-sm font-medium text-foreground hidden sm:block">
                                    {usuario.nome}
                                </span>
                            </Link>
                        </>
                    ) : (
                        <Link to="/login">
                            <Button variant="outline" size="sm" className="gap-1.5 px-2 py-1" label="Login" />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
