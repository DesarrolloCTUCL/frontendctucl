import dynamic from 'next/dynamic'

const PapeletaControlClient = dynamic(() => import('./papeleta_control_client'), {
  ssr: false,
})

export default function Page() {
  return <PapeletaControlClient />
}
