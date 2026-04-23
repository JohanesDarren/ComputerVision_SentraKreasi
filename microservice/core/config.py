import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load variables dari .env
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Variabel SUPABASE_URL dan SUPABASE_KEY belum di-set di file .env")

# Inisialisasi Supabase Client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
