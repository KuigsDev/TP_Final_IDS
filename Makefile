start-db:
	cd ./backend && docker compose up -d
stop-db:
	cd ./backend && docker compose down
run-backend:
	cd ./backend && npm run dev