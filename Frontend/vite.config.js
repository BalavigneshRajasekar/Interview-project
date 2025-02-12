/* eslint-disable no-unused-vars */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import  {Flowbite}  from 'flowbite-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react() ,
    tailwindcss(),
   
  ],
})
