import NowCLIDocs from '~/components/references-mdx/cli/index.mdx'
import ReferenceLayout from '~/components/layout/reference'
import { PRODUCT_SHORT_NAME } from '~/lib/constants'

const Index = () => (
  <ReferenceLayout
    Data={<NowCLIDocs />}
    title={`${PRODUCT_SHORT_NAME} CLI Reference`}
    description={`A complete reference of the ${PRODUCT_SHORT_NAME} CLI detailing the available commands, their usage and optional flags`}
  />
)

export default Index
