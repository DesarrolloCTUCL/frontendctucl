export default function FooterHome(){

    return(
        <footer className="border-t w-full flex items-center justify-center  bg-muted">
				<div className="container w-fit  flex items-center flex-col gap-2 py-4 md:flex-col md:py-6">
					<p className="text-xs text-muted-foreground">
						&copy; {new Date().getFullYear()} Consorcio Transporte Urbano Ciudad De Loja. Todos los derechos reservados.
					</p>
				</div>
			</footer>
    );
}