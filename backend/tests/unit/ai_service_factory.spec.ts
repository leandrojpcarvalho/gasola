import { test } from '@japa/runner'
import { AIServiceFactory } from '#services/integrations/ai_service_factory'

test.group('AIServiceFactory', (group) => {
  group.each.teardown(() => {
    AIServiceFactory.reset()
  })

  test('deve retornar instância de serviço quando disponível', async ({ assert }) => {
    const service = AIServiceFactory.getInstance()

    if (service) {
      assert.properties(service, ['providerName'])
      assert.isFunction(service.gerarPalavras)
      assert.isFunction(service.gerarDica)
      assert.isTrue(service.isAvailable())
    } else {
      assert.isNull(service)
    }
  })

  test('isAvailable deve refletir disponibilidade do serviço', async ({ assert }) => {
    const isAvailable = AIServiceFactory.isAvailable()
    const service = AIServiceFactory.getInstance()

    if (service) {
      assert.isTrue(isAvailable)
    } else {
      assert.isFalse(isAvailable)
    }
  })

  test('getProviderName deve retornar nome do provedor ou null', async ({ assert }) => {
    const providerName = AIServiceFactory.getProviderName()
    const service = AIServiceFactory.getInstance()

    if (service) {
      assert.equal(providerName, service.providerName)
      assert.oneOf(providerName, ['OpenAI', 'Gemini'])
    } else {
      assert.isNull(providerName)
    }
  })

  test('deve retornar mesmo provedor consistentemente', async ({ assert }) => {
    const service1 = AIServiceFactory.getInstance()

    const service2 = AIServiceFactory.getInstance()

    assert.equal(service1, service2)
  })

  test('deve resetar cache corretamente', async ({ assert }) => {
    const service1 = AIServiceFactory.getInstance()

    AIServiceFactory.reset()

    const service2 = AIServiceFactory.getInstance()

    if (service1) {
      assert.exists(service2)
    } else {
      assert.isNull(service2)
    }
  })

  test('deve retornar mesmo tipo após reset', async ({ assert }) => {
    const provider1 = AIServiceFactory.getProviderName()

    AIServiceFactory.reset()

    const provider2 = AIServiceFactory.getProviderName()

    assert.equal(provider1, provider2)
  })
})
