export function NotFound() {
    // refatorar utilizando componentes de estilo já existentes e tailwindcss com tematica de jogo da forca se possivel colocar uma pessoa enforcada ou algo do tipo
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <h1 className="text-9xl font-bold text-muted-foreground/30">404</h1>
            <p className="text-2xl text-foreground mt-4">Página Não Encontrada</p>
            <a
                href="/"
                className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition font-display font-medium"
            >
                Voltar para a Página Inicial
            </a>
        </div>

    )
}